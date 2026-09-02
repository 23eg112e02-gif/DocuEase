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

export const changePasswordRequest = async (payload) => unwrap(await api.put('/auth/password', payload));
