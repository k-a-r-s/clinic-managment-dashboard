// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "../features/auth/api/authApi";
import type { UserProfile } from "../types";


interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --------------------
// Context
// --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --------------------
// Provider
// --------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Fetch user on mount (browser sends cookies automatically)
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const serverUser = await authApi.me(); // API call with credentials included
        if (mounted) setUser(serverUser);
      } catch {
        if (mounted) setUser(null);
      }
    };

    fetchUser();

    return () => { mounted = false; };
  }, []);

  const login = (userData: UserProfile) => {
    // Server should set cookies on login; we just store profile
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout(); // optional: clears cookies server-side
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// Hook for usage
// --------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
