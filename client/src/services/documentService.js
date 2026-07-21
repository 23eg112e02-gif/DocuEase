import { api, unwrap } from './api.js';

export const listDocuments = async () => unwrap(await api.get('/documents'));
export const getDocument = async (id) => unwrap(await api.get(`/documents/${id}`));
export const createDocument = async (payload) => unwrap(await api.post('/documents', payload));
export const updateDocument = async (id, payload) => unwrap(await api.put(`/documents/${id}`, payload));
export const deleteDocument = async (id) => unwrap(await api.delete(`/documents/${id}`));
