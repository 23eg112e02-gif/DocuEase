import { createContext, useEffect, useState } from 'react';
import { changePasswordRequest, getCurrentUser, loginRequest, logoutRequest, registerRequest, updateProfileRequest } from '../services/authService.js';

export const AuthContext = createContext(null);

const normalizeUser = (user) => user || null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const data = await getCurrentUser();
      setUser(normalizeUser(data.user));
    } catch (_error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const data = await updateProfileRequest(payload);
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (payload) => {
    return changePasswordRequest(payload);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
