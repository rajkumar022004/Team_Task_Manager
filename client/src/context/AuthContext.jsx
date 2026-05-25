import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const persistAuth = useCallback((authToken, authUser) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  }, []);

  const signup = useCallback(async (userData) => {
    const response = await authService.signup(userData);
    persistAuth(response.data.token, response.data.user);
    return response;
  }, [persistAuth]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    persistAuth(response.data.token, response.data.user);
    return response;
  }, [persistAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      if (!user?.role) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === ROLES.ADMIN,
      isMember: user?.role === ROLES.MEMBER,
      role: user?.role ?? null,
      hasRole,
      signup,
      login,
      logout,
    }),
    [user, token, loading, hasRole, signup, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
