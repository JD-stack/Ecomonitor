/**
 * hooks/useAuth.tsx
 * Auth context provider + hook for the entire application.
 *
 * State stored in localStorage:
 *   eco_token — JWT string
 *   eco_user  — JSON-serialised AuthUser object
 *
 * isAdmin: boolean — derived from user.role === "admin"
 * Used by ProtectedRoute and components to conditionally render admin UI.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "../types";
import * as api from "../api";

interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Restore user from localStorage on app load (avoids flash of logged-out state)
    const stored = localStorage.getItem("eco_user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount, verify the stored token is still valid with the server
  useEffect(() => {
    const verify = async () => {
      if (!localStorage.getItem("eco_token")) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: serverUser } = await api.getMe();
        setUser(serverUser);
        localStorage.setItem("eco_user", JSON.stringify(serverUser));
      } catch {
        // Token is invalid or expired — clear session
        localStorage.removeItem("eco_token");
        localStorage.removeItem("eco_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: authUser } = await api.login(email, password);
    localStorage.setItem("eco_token", token);
    localStorage.setItem("eco_user", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { token, user: authUser } = await api.signup(name, email, password);
    localStorage.setItem("eco_token", token);
    localStorage.setItem("eco_user", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: user?.role === "admin", isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};