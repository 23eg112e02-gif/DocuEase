import { useEffect, useMemo, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { getAccessToken } from '../services/api.js';

const palette = ['#2b6fe8', '#00a67d', '#f97316', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#db2777'];

const toInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

const pickColor = (seed = '') => {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const resolveWsBaseUrl = () => {
  const explicitWsUrl = import.meta.env.VITE_COLLAB_WS_URL;
  if (explicitWsUrl) {
    return explicitWsUrl.replace(/\/$/, '');
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }

  if (apiUrl.startsWith('/')) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }

  const parsed = new URL(apiUrl);
  parsed.protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
  parsed.pathname = parsed.pathname.replace(/\/api\/?$/, '');
  return parsed.toString().replace(/\/$/, '');
};

const mapCollaborators = (states) =>
  Array.from(states.values())
    .map((state) => state?.user)
    .filter(Boolean)
    .reduce((acc, userState) => {
      if (!acc.some((entry) => entry.id === userState.id)) {
        acc.push(userState);
      }
      return acc;
    }, []);

export const useCollaboration = ({ enabled, documentId, user }) => {
  const [provider, setProvider] = useState(null);
  const [ydoc, setYdoc] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isSynced, setIsSynced] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  const collaborationUser = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    return {
      id: user.id,
      name: user.name || 'Anonymous user',
      initials: toInitials(user.name || 'Anonymous user'),
      color: pickColor(user.id)
    };
  }, [user?.id, user?.name]);

  useEffect(() => {
    if (!enabled || !documentId || !collaborationUser) {
      setProvider(null);
      setYdoc(null);
      setConnectionStatus('disconnected');
      setIsSynced(false);
      setCollaborators([]);
      return undefined;
    }

    const sharedDocument = new Y.Doc();
    const websocketBase = resolveWsBaseUrl();
    const token = getAccessToken();
    const websocketProvider = new WebsocketProvider(`${websocketBase}/collaboration`, documentId, sharedDocument, {
      connect: true,
      params: token ? { token } : {}
    });

    const syncHandler = (synced) => {
      setIsSynced(Boolean(synced));
    };

    const statusHandler = ({ status }) => {
      setConnectionStatus(status);
      if (status !== 'connected') {
        setIsSynced(false);
      }
    };

    const awarenessHandler = () => {
      setCollaborators(mapCollaborators(websocketProvider.awareness.getStates()));
    };

    websocketProvider.awareness.setLocalStateField('user', collaborationUser);
    websocketProvider.on('sync', syncHandler);
    websocketProvider.on('status', statusHandler);
    websocketProvider.awareness.on('change', awarenessHandler);

    setProvider(websocketProvider);
    setYdoc(sharedDocument);
    awarenessHandler();

    return () => {
      websocketProvider.awareness.off('change', awarenessHandler);
      websocketProvider.off('status', statusHandler);
      websocketProvider.off('sync', syncHandler);
      websocketProvider.awareness.setLocalState(null);
      websocketProvider.destroy();
      sharedDocument.destroy();
      setProvider(null);
      setYdoc(null);
      setConnectionStatus('disconnected');
      setIsSynced(false);
      setCollaborators([]);
    };
  }, [enabled, documentId, collaborationUser]);

  return {
    ydoc,
    provider,
    collaborators,
    connectionStatus,
    isSynced,
    collaborationUser
  };
};
