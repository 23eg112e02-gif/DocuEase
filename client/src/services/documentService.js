import { api, unwrap } from './api.js';

export const listDocuments = async (params = {}) => unwrap(await api.get('/documents', { params }));
export const getDocument = async (id) => unwrap(await api.get(`/documents/${id}`));
export const createDocument = async (payload) => unwrap(await api.post('/documents', payload));
export const updateDocument = async (id, payload) => unwrap(await api.put(`/documents/${id}`, payload));
export const duplicateDocument = async (id) => unwrap(await api.post(`/documents/${id}/duplicate`));
export const deleteDocument = async (id) => unwrap(await api.delete(`/documents/${id}`));
