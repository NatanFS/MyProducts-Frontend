'use client';

import React, { createContext, useState, useEffect } from 'react';
import apiFetch, { loginUser } from '../utils/api';
import { AuthContextProps, User } from '@/types';

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiFetch('/users/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data', error);
          logout();
        }
      }
      setIsAuthLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await loginUser(username, password);

      localStorage.setItem('token', access_token);

      const userData = await apiFetch('/users/me');
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
};
