import Document, { MAX_VERSIONS } from '../models/Document.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { documentSchema } from '../utils/validators.js';

const isOwner = (doc, userId) => String(doc.owner) === String(userId);

const isCollaborator = (doc, userId) =>
  (doc.collaborators || []).some((c) => String(c.user?._id || c.user) === String(userId));

const canAccess = (doc, userId) => isOwner(doc, userId) || isCollaborator(doc, userId);

const canEdit = (doc, userId) => {
  if (isOwner(doc, userId)) return true;
  const collab = (doc.collaborators || []).find((c) => String(c.user?._id || c.user) === String(userId));
  return collab?.role === 'editor';
};

const accessQuery = (userId) => ({
  $or: [{ owner: userId }, { 'collaborators.user': userId }]
});

const pushVersionSnapshot = (doc, userId, label = '') => {
  const snapshot = {
    title: doc.title,
    content: doc.content,
    savedBy: userId,
    label
  };
  doc.versions = [snapshot, ...(doc.versions || [])].slice(0, MAX_VERSIONS);
};

export const listDocuments = asyncHandler(async (req, res) => {
  const { search, status, sortBy = 'updatedAt', order = 'desc', filter } = req.query;

  const query = accessQuery(req.user._id);

  if (filter === 'owned') {
    query.$or = [{ owner: req.user._id }];
  } else if (filter === 'shared') {
    query.$or = [{ 'collaborators.user': req.user._id }];
  }

  if (status && ['draft', 'published', 'archived'].includes(status)) {
    query.status = status;
  }

  if (search && search.trim()) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortField = ['updatedAt', 'createdAt', 'title'].includes(sortBy) ? sortBy : 'updatedAt';

  const documents = await Document.find(query)
    .select('-versions')
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort({ [sortField]: sortOrder });

  res.json(new ApiResponse(200, { documents }, 'Documents fetched'));
});

export const createDocument = asyncHandler(async (req, res) => {
  const parsed = documentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const document = await Document.create({
    ...parsed.data,
    owner: req.user._id
  });

  res.status(201).json(new ApiResponse(201, { document }, 'Document created'));
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    ...accessQuery(req.user._id)
  })
    .select('-versions')
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email');

  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  res.json(
    new ApiResponse(
      200,
      {
        document,
        access: {
          isOwner: isOwner(document, req.user._id),
          canEdit: canEdit(document, req.user._id)
        }
      },
      'Document fetched'
    )
  );
});

export const updateDocument = asyncHandler(async (req, res) => {
  const parsed = documentSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const existing = await Document.findById(req.params.id);
  if (!existing || !canAccess(existing, req.user._id)) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  if (!canEdit(existing, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Viewer role cannot edit this document' });
  }

  if (parsed.data.status && !isOwner(existing, req.user._id)) {
    delete parsed.data.status;
  }

  const contentChanged =
    (parsed.data.content !== undefined && parsed.data.content !== existing.content) ||
    (parsed.data.title !== undefined && parsed.data.title !== existing.title);

  if (contentChanged) {
    pushVersionSnapshot(existing, req.user._id);
  }

  Object.assign(existing, parsed.data);
  await existing.save();

  const document = await Document.findById(existing._id)
    .select('-versions')
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email');

  res.json(new ApiResponse(200, { document }, 'Document updated'));
});

export const duplicateDocument = asyncHandler(async (req, res) => {
  const original = await Document.findOne({
    _id: req.params.id,
    ...accessQuery(req.user._id)
  });

  if (!original) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  const duplicate = await Document.create({
    title: `Copy of ${original.title}`,
    content: original.content,
    status: 'draft',
    source: original.source,
    owner: req.user._id
  });

  res.status(201).json(new ApiResponse(201, { document: duplicate }, 'Document duplicated'));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  if (!isOwner(document, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Only the owner can delete this document' });
  }

  await Document.findByIdAndDelete(req.params.id);
  res.json(new ApiResponse(200, { documentId: req.params.id }, 'Document deleted'));
});

export const shareDocument = asyncHandler(async (req, res) => {
  const { email, role = 'editor' } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  if (!['editor', 'viewer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role must be editor or viewer' });
  }

  const document = await Document.findById(req.params.id);
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  if (!isOwner(document, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Only the owner can share this document' });
  }

  const targetUser = await User.findOne({ email: email.trim().toLowerCase() }).select('_id name email');
  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'No user found with that email. They must create an account first.' });
  }

  if (String(targetUser._id) === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'You cannot share a document with yourself' });
  }

  const already = (document.collaborators || []).some((c) => String(c.user) === String(targetUser._id));
  if (already) {
    document.collaborators = document.collaborators.map((c) =>
      String(c.user) === String(targetUser._id) ? { ...c.toObject?.() ?? c, role } : c
    );
  } else {
    document.collaborators.push({
      user: targetUser._id,
      role,
      addedAt: new Date()
    });
  }

  await document.save();
  await document.populate('collaborators.user', 'name email');
  await document.populate('owner', 'name email');

  res.json(
    new ApiResponse(
      200,
      { document },
      already ? 'Collaborator role updated' : 'Document shared successfully'
    )
  );
});

export const unshareDocument = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const document = await Document.findById(req.params.id);
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const requesterIsOwner = isOwner(document, req.user._id);
  const requesterIsTarget = String(req.user._id) === String(userId);

  if (!requesterIsOwner && !requesterIsTarget) {
    return res.status(403).json({ success: false, message: 'Not allowed to remove this collaborator' });
  }

  document.collaborators = (document.collaborators || []).filter(
    (c) => String(c.user) !== String(userId)
  );
  await document.save();
  await document.populate('collaborators.user', 'name email');
  await document.populate('owner', 'name email');

  res.json(new ApiResponse(200, { document }, 'Collaborator removed'));
});

export const listCollaborators = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    ...accessQuery(req.user._id)
  })
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email');

  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  res.json(
    new ApiResponse(
      200,
      {
        owner: document.owner,
        collaborators: document.collaborators || [],
        isOwner: isOwner(document, req.user._id)
      },
      'Collaborators fetched'
    )
  );
});

export const listVersions = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    ...accessQuery(req.user._id)
  })
    .select('title versions')
    .populate('versions.savedBy', 'name email');

  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  const versions = (document.versions || []).map((v) => ({
    _id: v._id,
    title: v.title,
    label: v.label,
    createdAt: v.createdAt,
    savedBy: v.savedBy,
    preview: (v.content || '').replace(/<[^>]+>/g, ' ').slice(0, 120)
  }));

  res.json(new ApiResponse(200, { versions, currentTitle: document.title }, 'Versions fetched'));
});

export const restoreVersion = asyncHandler(async (req, res) => {
  const { versionId } = req.params;

  const document = await Document.findById(req.params.id);
  if (!document || !canAccess(document, req.user._id)) {
    return res.status(404).json({ success: false, message: 'Document not found or access denied' });
  }

  if (!canEdit(document, req.user._id)) {
    return res.status(403).json({ success: false, message: 'Viewer role cannot restore versions' });
  }

  const version = (document.versions || []).id(versionId);
  if (!version) {
    return res.status(404).json({ success: false, message: 'Version not found' });
  }

  // Snapshot current state before restore
  pushVersionSnapshot(document, req.user._id, 'Before restore');

  document.title = version.title;
  document.content = version.content;
  await document.save();

  const updated = await Document.findById(document._id)
    .select('-versions')
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email');

  res.json(new ApiResponse(200, { document: updated }, 'Version restored'));
});
