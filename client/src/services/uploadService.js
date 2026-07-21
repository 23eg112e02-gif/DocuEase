import { api, unwrap } from './api.js';

export const uploadFile = async (formData) => {
  const response = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return unwrap(response);
};

export const listUploads = async () => unwrap(await api.get('/uploads'));
