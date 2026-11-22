'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from './types';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  loginAsDemoMaker: () => void;
  loginAsAdmin: () => void;
  login: (email: string, displayName?: string) => void;
  logout: () => void;
}

const DEMO_MAKER: Profile = {
  id: 'usr-demo-maker',
  email: 'maker@resprout.eco',
  displayName: 'Nur Fitri (Maker)',
  role: 'maker',
  createdAt: new Date().toISOString(),
};

const DEMO_ADMIN: Profile = {
  id: 'usr-admin',
  email: 'admin@resprout.eco',
  displayName: 'Admin User',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginAsDemoMaker: () => {},
  loginAsAdmin: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in local storage
    try {
      const stored = localStorage.getItem('resprout_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo maker for seamless demo walkthrough
        setUser(DEMO_MAKER);
        localStorage.setItem('resprout_user', JSON.stringify(DEMO_MAKER));
      }
    } catch {
      setUser(DEMO_MAKER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemoMaker = () => {
    setUser(DEMO_MAKER);
    localStorage.setItem('resprout_user', JSON.stringify(DEMO_MAKER));
  };

  const loginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem('resprout_user', JSON.stringify(DEMO_ADMIN));
  };

  const login = (email: string, displayName = 'Maker User') => {
    const newUser: Profile = {
      id: `usr-${Date.now()}`,
      email,
      displayName,
      role: 'maker',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('resprout_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resprout_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginAsDemoMaker, loginAsAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
