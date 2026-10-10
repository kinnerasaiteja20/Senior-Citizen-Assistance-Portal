import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { authApi } from '../api.ts';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('portal_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await authApi.getMe();
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        console.warn('Failed to load user session. Clearing token.');
        localStorage.removeItem('portal_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('portal_token', res.token);
      setToken(res.token);
      setUser(res.user);
      const meData = await authApi.getMe();
      setProfile(meData.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      localStorage.setItem('portal_token', res.token);
      setToken(res.token);
      setUser(res.user);
      const meData = await authApi.getMe();
      setProfile(meData.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const quickDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      let email = 'margaret@senior.org';
      if (role === 'volunteer') email = 'sarah@volunteer.org';
      if (role === 'admin') email = 'admin@portal.org';

      const res = await authApi.login({ email, password: 'Password123!' });
      localStorage.setItem('portal_token', res.token);
      setToken(res.token);
      setUser(res.user);
      const meData = await authApi.getMe();
      setProfile(meData.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: any) => {
    const res = await authApi.updateProfile(data);
    setUser(res.user);
    if (res.profile) setProfile(res.profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
