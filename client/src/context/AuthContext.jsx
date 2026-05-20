import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from token on mount
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('placemint_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      setUser(data.data.user);
      setProfile(data.data.profile);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('placemint_token');
      localStorage.removeItem('placemint_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('placemint_token', data.data.token);
    localStorage.setItem('placemint_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    setIsAuthenticated(true);
    await loadUser(); // Load full profile
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('placemint_token', data.data.token);
    localStorage.setItem('placemint_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    setIsAuthenticated(true);
    await loadUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('placemint_token');
    localStorage.removeItem('placemint_user');
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const { data } = await authAPI.updateProfile(profileData);
    setUser(data.data.user);
    setProfile(data.data.profile);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isAuthenticated,
      login, register, logout, updateProfile, loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
