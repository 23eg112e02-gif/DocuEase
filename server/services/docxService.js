import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { stripHtml } from '../utils/helpers.js';

export const generateDocxBuffer = async ({ title, content }) => {
  const plain = stripHtml(content || '');
  const rawParagraphs = plain.split(/\r?\n+/).filter((p) => p.trim().length > 0);

  const contentParagraphs = rawParagraphs.length > 0
    ? rawParagraphs.map((text) => new Paragraph({
        children: [new TextRun({ text, size: 22 })],
        spacing: { after: 140, line: 320 }
      }))
    : [new Paragraph({ children: [new TextRun({ text: 'No content provided.', size: 22, italics: true })] })];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: title || 'DocuEase Document',
                bold: true,
                size: 36,
                color: '111827'
              })
            ],
            spacing: { after: 280 }
          }),
          ...contentParagraphs
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
};
