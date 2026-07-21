import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export const parseImportedFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.txt') {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  }

  if (extension === '.pdf') {
    const buffer = await fs.readFile(filePath);
    const result = await pdfParse(buffer);
    return result.text || '';
  }

  if (extension === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  return '';
};
