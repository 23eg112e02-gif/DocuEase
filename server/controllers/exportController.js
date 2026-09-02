import Document from '../models/Document.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generatePdfBuffer } from '../services/pdfService.js';
import { generateDocxBuffer } from '../services/docxService.js';
import { stripHtml } from '../utils/helpers.js';

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

const sanitizeFilename = (title, ext) => {
  const safe = (title || 'document').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '');
  return `${safe || 'document'}.${ext}`;
};

export const exportPdf = asyncHandler(async (req, res) => {
  const payload = await resolvePayload(req);
  if (!payload) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const buffer = await generatePdfBuffer(payload);
  const fileName = sanitizeFilename(payload.title, 'pdf');
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
  const fileName = sanitizeFilename(payload.title, 'docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
  res.send(buffer);
});

export const exportTxt = asyncHandler(async (req, res) => {
  const payload = await resolvePayload(req);
  if (!payload) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  const plain = stripHtml(payload.content || '');
  const fileContent = `${payload.title}\n${'='.repeat(payload.title.length)}\n\n${plain}`;
  const fileName = sanitizeFilename(payload.title, 'txt');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
  res.send(Buffer.from(fileContent, 'utf-8'));
});

export const exportMd = asyncHandler(async (req, res) => {
  const payload = await resolvePayload(req);
  if (!payload) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }

  let md = payload.content || '';
  md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<u>(.*?)<\/u>/gi, '$1');
  md = md.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  md = stripHtml(md);

  const fileContent = `# ${payload.title}\n\n${md.trim()}`;
  const fileName = sanitizeFilename(payload.title, 'md');

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
  res.send(Buffer.from(fileContent, 'utf-8'));
});
