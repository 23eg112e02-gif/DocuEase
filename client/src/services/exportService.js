import { api } from './api.js';

const getCleanFilename = (title, ext) => {
  const safe = (title || 'document').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '');
  return `${safe || 'document'}.${ext}`;
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export const exportPdf = async (payload) => {
  const filename = getCleanFilename(payload?.title, 'pdf');
  const response = await api.post('/export/pdf', payload, { responseType: 'blob' });
  downloadBlob(response.data, filename);
};

export const exportDocx = async (payload) => {
  const filename = getCleanFilename(payload?.title, 'docx');
  const response = await api.post('/export/docx', payload, { responseType: 'blob' });
  downloadBlob(response.data, filename);
};

export const exportTxt = async (payload) => {
  const filename = getCleanFilename(payload?.title, 'txt');
  const response = await api.post('/export/txt', payload, { responseType: 'blob' });
  downloadBlob(response.data, filename);
};

export const exportMd = async (payload) => {
  const filename = getCleanFilename(payload?.title, 'md');
  const response = await api.post('/export/md', payload, { responseType: 'blob' });
  downloadBlob(response.data, filename);
};

export const exportHtml = (payload) => {
  const title = payload?.title || 'DocuEase Document';
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1f2937; }
    h1 { font-size: 2.25rem; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
    table, th, td { border: 1px solid #d1d5db; }
    th, td { padding: 8px 12px; text-align: left; }
    th { background-color: #f3f4f6; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin-left: 0; color: #4b5563; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${payload?.content || ''}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, getCleanFilename(title, 'html'));
};
