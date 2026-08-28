'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '@/types/auth';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = api.getCurrentUser();
        const currentToken = api.getCurrentToken();
        if (currentUser && currentToken) {
          setUser(currentUser);
          setToken(currentToken);
        } else {
          // Auto-initialize demo guest for zero-friction recruiter portfolio viewing
          const res = await api.loginAsDemoGuest();
          setUser(res.user);
          setToken(res.token);
        }
      } catch (err) {
        console.error('Failed to initialize auth session', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.register(credentials);
      setUser(res.user);
      setToken(res.token);
      toast.success(`Account created! Welcome, ${res.user.name}`);
      return res.user;
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoGuest = async (): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.loginAsDemoGuest();
      setUser(res.user);
      setToken(res.token);
      toast.success('Signed in as Recruiter Demo Guest ⚡');
      return res.user;
    } catch (err: any) {
      toast.error('Demo login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setUser(null);
      setToken(null);
      toast.info('Signed out');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemoGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
