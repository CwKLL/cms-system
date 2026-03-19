'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cms_user_id');
    if (stored) {
      const found = MOCK_USERS.find((u) => u.id === stored) ?? null;
      setCurrentUser(found);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('cms_user_id', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cms_user_id');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
