import { api, setAccessToken, clearAccessToken, unwrap } from './api.js';

export const registerRequest = async (payload) => {
  const data = unwrap(await api.post('/auth/register', payload));
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
};

export const loginRequest = async (payload) => {
  const data = unwrap(await api.post('/auth/login', payload));
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
};

export const logoutRequest = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
};

export const getCurrentUser = async () => unwrap(await api.get('/auth/me'));

export const updateProfileRequest = async (payload) => unwrap(await api.put('/auth/profile', payload));

export const changePasswordRequest = async (payload) => {
  const data = unwrap(await api.put('/auth/password', payload));
  clearAccessToken();
  return data;
};

export const forgotPasswordRequest = async (payload) => unwrap(await api.post('/auth/forgot-password', payload));

export const resetPasswordRequest = async (payload) => unwrap(await api.post('/auth/reset-password', payload));

export const logoutAllRequest = async () => {
  try {
    await api.post('/auth/logout-all');
  } finally {
    clearAccessToken();
  }
};

export const exportDataRequest = async () => unwrap(await api.get('/auth/export-data'));

export const deleteAccountRequest = async (payload) => {
  try {
    return await unwrap(await api.delete('/auth/delete-account', { data: payload }));
  } finally {
    clearAccessToken();
  }
};
