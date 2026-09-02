import PDFDocument from 'pdfkit';
import { stripHtml } from '../utils/helpers.js';

export const generatePdfBuffer = ({ title, content }) =>
  new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: 'A4',
      margin: 54,
      info: {
        Title: title || 'DocuEase Document',
        Author: 'DocuEase'
      }
    });
    const buffers = [];

    document.on('data', (chunk) => buffers.push(chunk));
    document.on('end', () => resolve(Buffer.concat(buffers)));
    document.on('error', reject);

    // Document Title Header
    document
      .font('Helvetica-Bold')
      .fontSize(22)
      .fillColor('#111827')
      .text(title || 'DocuEase Document', { align: 'center' });

    document.moveDown(0.5);

    // Divider rule
    document
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(54, document.y)
      .lineTo(document.page.width - 54, document.y)
      .stroke();

    document.moveDown(1);

    // Body content
    const plainText = stripHtml(content || '') || 'No content provided.';
    document
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#374151')
      .lineGap(4)
      .text(plainText, {
        align: 'left',
        paragraphGap: 8
      });

    document.end();
  });
