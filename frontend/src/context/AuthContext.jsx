import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, signup as signupApi, getMe } from '../api/authApi.js';
import { getErrorMessage } from '../utils/helpers.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMe();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [clearAuth]);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    persistAuth(data.token, data.user);
    return data;
  };

  const signup = async (userData) => {
    const { data } = await signupApi(userData);
    persistAuth(data.token, data.user);
    return data;
  };

  const logout = () => clearAuth();

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isAuthenticated: !!user,
        getErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
