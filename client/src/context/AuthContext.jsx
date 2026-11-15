import { createContext, useEffect, useState } from 'react';
import { changePasswordRequest, deleteAccountRequest, exportDataRequest, getCurrentUser, loginRequest, logoutAllRequest, logoutRequest, registerRequest, updateProfileRequest } from '../services/authService.js';

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
    const result = await changePasswordRequest(payload);
    setUser(null);
    return result;
  };

  const logoutAll = async () => {
    await logoutAllRequest();
    setUser(null);
  };

  const exportData = async () => exportDataRequest();

  const deleteAccount = async (payload) => {
    const result = await deleteAccountRequest(payload);
    setUser(null);
    return result;
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
        logoutAll,
        exportData,
        deleteAccount,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
