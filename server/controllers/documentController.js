import Document from '../models/Document.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { documentSchema } from '../utils/validators.js';

export const listDocuments = asyncHandler(async (req, res) => {
  const { search, status, sortBy = 'updatedAt', order = 'desc' } = req.query;

  const query = { owner: req.user._id };

  if (status && ['draft', 'published', 'archived'].includes(status)) {
    query.status = status;
  }

  if (search && search.trim()) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortField = ['updatedAt', 'createdAt', 'title'].includes(sortBy) ? sortBy : 'updatedAt';

  const documents = await Document.find(query).sort({ [sortField]: sortOrder });
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
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  res.json(new ApiResponse(200, { document }, 'Document fetched'));
});

export const updateDocument = asyncHandler(async (req, res) => {
  const parsed = documentSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const document = await Document.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: parsed.data },
    { new: true }
  );

  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  res.json(new ApiResponse(200, { document }, 'Document updated'));
});

export const duplicateDocument = asyncHandler(async (req, res) => {
  const original = await Document.findOne({ _id: req.params.id, owner: req.user._id });
  if (!original) {
    return res.status(404).json({ success: false, message: 'Document not found' });
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
  const document = await Document.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  res.json(new ApiResponse(200, { documentId: req.params.id }, 'Document deleted'));
});
