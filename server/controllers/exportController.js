import Document from '../models/Document.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generatePdfBuffer } from '../services/pdfService.js';
import { generateDocxBuffer } from '../services/docxService.js';

const resolvePayload = async (req) => {
  if (req.body.documentId) {
    const query = { _id: req.body.documentId };
    if (req.user?._id) {
      query.owner = req.user._id;
    }

    const document = await Document.findOne(query);
    if (!document) {
      return null;
    }

    return {
      title: document.title,
      content: document.content
    };
  }

  return {
    title: req.body.title || 'DocuEase Document',
    content: req.body.content || ''
  };
};

export const exportPdf = asyncHandler(async (req, res) => {
  const payload = await resolvePayload(req);
  if (!payload) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const buffer = await generatePdfBuffer(payload);
  const fileName = `${payload.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'document'}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
  res.send(buffer);
});

export const exportDocx = asyncHandler(async (req, res) => {
  const payload = await resolvePayload(req);
  if (!payload) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const buffer = await generateDocxBuffer(payload);
  const fileName = `${payload.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'document'}.docx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
  res.send(buffer);
});
