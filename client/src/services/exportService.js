import { api } from './api.js';

const downloadBlob = (blob, fallbackName) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fallbackName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export const exportPdf = async (payload) => {
  const response = await api.post('/export/pdf', payload, { responseType: 'blob' });
  downloadBlob(response.data, 'docuease-document.pdf');
};

export const exportDocx = async (payload) => {
  const response = await api.post('/export/docx', payload, { responseType: 'blob' });
  downloadBlob(response.data, 'docuease-document.docx');
};
