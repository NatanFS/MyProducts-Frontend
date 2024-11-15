// src/context/AuthContext.tsx

'use client';

import React, { createContext, useState, useEffect } from 'react';
import apiFetch, { loginUser } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiFetch('/users/me')
        .then((data) => setUser(data))
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await loginUser(username, password);

      localStorage.setItem('token', access_token);

      const userData = await apiFetch('/users/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to login', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
