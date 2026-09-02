import path from 'path';
import Upload from '../models/Upload.js';
import Document from '../models/Document.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { parseImportedFile } from '../services/parserService.js';

export const handleUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File is required' });
  }

  const parsedContent = await parseImportedFile(req.file.path);
  const upload = await Upload.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    fileType: req.file.mimetype,
    owner: req.user._id
  });

  const shouldImport = String(req.body.importAsDocument || '').toLowerCase() === 'true';
  let importedDocument = null;

  if (shouldImport) {
    const title = path.parse(req.file.originalname).name || 'Imported Document';
    importedDocument = await Document.create({
      title,
      content: parsedContent,
      owner: req.user._id,
      status: 'draft',
      source: 'upload'
    });
  }

  res.status(201).json(
    new ApiResponse(201, { upload, parsedContent, importedDocument }, shouldImport ? 'File imported' : 'File uploaded')
  );
});

export const listUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { uploads }, 'Uploads fetched'));
});

export const deleteUpload = asyncHandler(async (req, res) => {
  const upload = await Upload.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!upload) {
    return res.status(404).json({ success: false, message: 'Upload not found' });
  }

  res.json(new ApiResponse(200, { uploadId: req.params.id }, 'Upload deleted'));
});
