import PDFDocument from 'pdfkit';
import { stripHtml } from '../utils/helpers.js';

export const generatePdfBuffer = ({ title, content }) =>
  new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 48 });
    const buffers = [];

    document.on('data', (chunk) => buffers.push(chunk));
    document.on('end', () => resolve(Buffer.concat(buffers)));
    document.on('error', reject);

    document.fontSize(20).text(title || 'DocuEase Document', { align: 'center' });
    document.moveDown();
    document.fontSize(12).text(stripHtml(content || ''), { align: 'left' });
    document.end();
  });
