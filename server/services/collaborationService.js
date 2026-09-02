import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { WebSocketServer, WebSocket } from 'ws';
import { Types } from 'mongoose';
import Document from '../models/Document.js';
import { verifyAccessToken } from './tokenService.js';
import { logError, logInfo } from '../utils/logger.js';

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;
const saveDebounceMs = 1200;

const rooms = new Map();

const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((acc, chunk) => {
      const separator = chunk.indexOf('=');
      if (separator === -1) {
        return acc;
      }

      const key = chunk.slice(0, separator).trim();
      const value = chunk.slice(separator + 1).trim();
      if (key) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});

const extractBearerToken = (request) => {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  return authorization.slice(7);
};

const extractQueryToken = (request) => {
  try {
    const url = new URL(request.url || '', 'http://localhost');
    return url.searchParams.get('token') || url.searchParams.get('accessToken') || null;
  } catch (_e) {
    return null;
  }
};

const getRequestUserId = (request) => {
  const cookies = parseCookies(request.headers.cookie || '');
  const accessToken = cookies.accessToken || extractBearerToken(request) || extractQueryToken(request);

  if (!accessToken) {
    return null;
  }

  try {
    const payload = verifyAccessToken(accessToken);
    return payload?.id || null;
  } catch (_error) {
    return null;
  }
};

const getDocumentIdFromPath = (urlPath = '') => {
  const [pathWithoutQuery] = urlPath.split('?');
  const parts = pathWithoutQuery.split('/').filter(Boolean);

  if (parts.length < 2 || parts[0] !== 'collaboration') {
    return null;
  }

  const docId = parts[1];
  if (!Types.ObjectId.isValid(docId)) {
    return null;
  }

  return docId;
};

const sendMessage = (socket, payload) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(payload);
  }
};

const readAwarenessClientIds = (awarenessUpdate) => {
  const decoder = decoding.createDecoder(awarenessUpdate);
  const length = decoding.readVarUint(decoder);
  const clientIds = [];

  for (let index = 0; index < length; index += 1) {
    clientIds.push(decoding.readVarUint(decoder));
    decoding.readVarUint(decoder);
    decoding.readVarString(decoder);
  }

  return clientIds;
};

const broadcastRoom = (room, payload, excludeSocket = null) => {
  room.clients.forEach((client) => {
    if (client !== excludeSocket) {
      sendMessage(client, payload);
    }
  });
};

const scheduleStateSave = (room) => {
  if (room.saveTimer) {
    clearTimeout(room.saveTimer);
  }

  room.saveTimer = setTimeout(async () => {
    room.saveTimer = null;
    const encodedState = Buffer.from(Y.encodeStateAsUpdate(room.doc));

    try {
      await Document.findByIdAndUpdate(room.docId, {
        $set: { collaborationState: encodedState }
      });
    } catch (error) {
      logError(error);
    }
  }, saveDebounceMs);
};

const createRoom = async (docId) => {
  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);
  const room = {
    docId,
    doc,
    awareness,
    clients: new Set(),
    saveTimer: null
  };

  const existing = await Document.findById(docId).select('+collaborationState');
  if (existing?.collaborationState?.length) {
    Y.applyUpdate(doc, new Uint8Array(existing.collaborationState), 'bootstrap');
  }

  doc.on('update', (update, origin) => {
    if (origin?.skipBroadcast !== true) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      broadcastRoom(room, encoding.toUint8Array(encoder), origin?.socket || null);
    }

    scheduleStateSave(room);
  });

  awareness.on('update', ({ added, updated, removed }, origin) => {
    const changedClients = [...added, ...updated, ...removed];
    if (changedClients.length === 0) {
      return;
    }

    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients);
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(encoder, awarenessUpdate);
    broadcastRoom(room, encoding.toUint8Array(encoder), origin?.socket || null);
  });

  rooms.set(docId, room);
  return room;
};

const getRoom = async (docId) => {
  const existingRoom = rooms.get(docId);
  if (existingRoom) {
    return existingRoom;
  }

  return createRoom(docId);
};

const cleanupRoom = (room) => {
  if (room.clients.size > 0) {
    return;
  }

  if (room.saveTimer) {
    clearTimeout(room.saveTimer);
    room.saveTimer = null;
  }

  const encodedState = Buffer.from(Y.encodeStateAsUpdate(room.doc));
  Document.findByIdAndUpdate(room.docId, {
    $set: { collaborationState: encodedState }
  }).catch(logError);

  room.awareness.destroy();
  room.doc.destroy();
  rooms.delete(room.docId);
};

const sendInitialSync = (socket, room) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, room.doc);
  sendMessage(socket, encoding.toUint8Array(encoder));

  const states = Array.from(room.awareness.getStates().keys());
  if (states.length > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, messageAwareness);
    encoding.writeVarUint8Array(awarenessEncoder, awarenessProtocol.encodeAwarenessUpdate(room.awareness, states));
    sendMessage(socket, encoding.toUint8Array(awarenessEncoder));
  }
};

const handleSyncMessage = (room, socket, decoder) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);

  const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, room.doc, {
    socket,
    skipBroadcast: true
  });

  if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
    syncProtocol.writeSyncStep1(encoder, room.doc);
  }

  if (encoding.length(encoder) > 1) {
    sendMessage(socket, encoding.toUint8Array(encoder));
  }
};

const handleAwarenessMessage = (room, socket, decoder) => {
  const awarenessUpdate = decoding.readVarUint8Array(decoder);
  const clientIds = readAwarenessClientIds(awarenessUpdate);
  clientIds.forEach((clientId) => {
    socket.awarenessClientIds.add(clientId);
  });
  awarenessProtocol.applyAwarenessUpdate(room.awareness, awarenessUpdate, { socket });
};

const handleQueryAwareness = (room, socket) => {
  const states = Array.from(room.awareness.getStates().keys());
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageAwareness);
  encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(room.awareness, states));
  sendMessage(socket, encoding.toUint8Array(encoder));
};

const handleSocketMessage = (room, socket, rawData) => {
  const message = rawData instanceof Uint8Array ? rawData : new Uint8Array(rawData);
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);

  if (messageType === messageSync) {
    handleSyncMessage(room, socket, decoder);
    return;
  }

  if (messageType === messageAwareness) {
    handleAwarenessMessage(room, socket, decoder);
    return;
  }

  if (messageType === messageQueryAwareness) {
    handleQueryAwareness(room, socket);
  }
};

const disconnectSocket = (room, socket) => {
  if (socket.disconnected) {
    return;
  }

  socket.disconnected = true;

  if (socket.awarenessClientIds.size > 0) {
    awarenessProtocol.removeAwarenessStates(room.awareness, Array.from(socket.awarenessClientIds), { socket });
  }

  room.clients.delete(socket);
  cleanupRoom(room);
};

const attachSocketToRoom = async (socket, request) => {
  const docId = getDocumentIdFromPath(request.url || '');
  if (!docId) {
    socket.close(1008, 'Invalid collaboration room');
    return;
  }

  const userId = getRequestUserId(request);
  if (!userId) {
    socket.close(4401, 'Authentication required');
    return;
  }

  const canAccess = await Document.exists({ _id: docId, owner: userId });
  if (!canAccess) {
    socket.close(4403, 'Document access denied');
    return;
  }

  const room = await getRoom(docId);
  socket.disconnected = false;
  socket.awarenessClientIds = new Set();
  room.clients.add(socket);
  sendInitialSync(socket, room);

  socket.on('message', (rawData) => {
    try {
      handleSocketMessage(room, socket, rawData);
    } catch (error) {
      logError(error);
    }
  });

  socket.on('close', () => {
    disconnectSocket(room, socket);
  });

  socket.on('error', (error) => {
    logError(error);
    disconnectSocket(room, socket);
  });
};

export const setupCollaborationServer = (httpServer) => {
  const websocketServer = new WebSocketServer({ noServer: true });

  const heartbeatInterval = setInterval(() => {
    websocketServer.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  websocketServer.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  httpServer.on('upgrade', (request, socket, head) => {
    const docId = getDocumentIdFromPath(request.url || '');
    if (!docId) {
      return;
    }

    websocketServer.handleUpgrade(request, socket, head, (ws) => {
      websocketServer.emit('connection', ws, request);
    });
  });

  websocketServer.on('connection', (socket, request) => {
    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });

    attachSocketToRoom(socket, request).catch((error) => {
      logError(error);
      socket.close(1011, 'Collaboration service error');
    });
  });

  logInfo('Yjs collaboration websocket is enabled at /collaboration/:documentId (heartbeats enabled)');
};
