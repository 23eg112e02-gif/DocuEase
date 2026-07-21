import { Document, Packer, Paragraph, TextRun } from 'docx';
import { stripHtml } from '../utils/helpers.js';

export const generateDocxBuffer = async ({ title, content }) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: title || 'DocuEase Document', bold: true, size: 28 })],
            alignment: 'center'
          }),
          new Paragraph({ text: '' }),
          new Paragraph(stripHtml(content || ''))
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
};
