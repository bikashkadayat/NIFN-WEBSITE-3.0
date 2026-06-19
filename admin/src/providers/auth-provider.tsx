"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";
import * as auth from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      const storedUser = auth.getUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        auth.removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const userData = await auth.login(email, password);
      setUser(userData);
      return userData;
    },
    []
  );

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      // Super Admin always has all permissions
      if (user.role === "Super Admin" || user.role === "super-admin" || user.role === "super_admin") return true;
      if (user.permissions?.includes("*")) return true;
      return user.permissions?.includes(permission) ?? false;
    },
    [user]
  );

  const hasRole = useCallback(
    (...roles: string[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
