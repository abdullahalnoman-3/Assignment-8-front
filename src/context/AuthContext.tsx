'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  googleLogin: (email: string, name: string, image?: string) => Promise<boolean>;
  githubLogin: (email: string, name: string, image?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, image?: string) => Promise<boolean>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // রিফ্রেশ সমস্যার চাবিকাঠি!

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('kindnet_token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        // সার্ভার থেকে ইউজার প্রোফাইল এনে সেশন রিস্টোর করা
        const res = await fetchApi<{ success: boolean; user: User }>('/auth/me', {
          token: storedToken,
        });

        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('kindnet_token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('kindnet_token');
      } finally {
        setIsLoading(false); // চেক শেষ হলে তবেই লোডিং বন্ধ হবে
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.success) {
        localStorage.setItem('kindnet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success('Logged in successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed.');
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<boolean> => {
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, image }),
      });
      if (res.success) {
        localStorage.setItem('kindnet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    }
  };

  const googleLogin = async (email: string, name: string, image?: string) => {
    try {
      const res = await fetchApi('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ email, name, image }),
      });
      if (res.success) {
        localStorage.setItem('kindnet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success('Google sign-in successful!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const githubLogin = async (email: string, name: string, image?: string) => {
    try {
      const res = await fetchApi('/auth/github', {
        method: 'POST',
        body: JSON.stringify({ email, name, image }),
      });
      if (res.success) {
        localStorage.setItem('kindnet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success('GitHub sign-in successful!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('kindnet_token');
    setToken(null);
    setUser(null);
    toast.info('Logged out.');
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const updateProfile = async (name: string, image?: string): Promise<boolean> => {
    try {
      const res = await fetchApi<{ success: boolean; message?: string; user?: User }>('/auth/profile', {
        method: 'PUT',
        token: token || undefined,
        body: JSON.stringify({ name, image }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        toast.success(res.message || 'Profile updated successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
        updateProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

