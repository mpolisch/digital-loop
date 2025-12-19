"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

    const checkSessionHealth = React.useCallback(async (authToken: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/users/session`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.needsReauth) {
                    console.warn('Spotify session expired. User needs to re-authenticate.');
                    // Optionally show a notification to the user
                }
            }
        } catch (error) {
            console.error('Error checking session health:', error);
        }
    }, []);

    const fetchUser = React.useCallback(async (authToken: string) => {
        try {
        const response = await fetch('/api/users/profile', {
            headers: {
            'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            
            // Check Spotify session health
            checkSessionHealth(authToken);
        } else {
            // Token is invalid, remove it
            logout();
        }
        } catch (error) {
        console.error('Error fetching user:', error);
        logout();
        } finally {
        setLoading(false);
        }
    }, [checkSessionHealth]);

    const login = React.useCallback((authToken: string) => {
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        fetchUser(authToken);
    }, [fetchUser]);


  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      // Check URL hash for token from Spotify callback
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      const authToken = params.get('token');
      
      if (authToken) {
        login(authToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setLoading(false);
      }
    }
  }, [fetchUser, login]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};