"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  [key: string]: any;
}

interface JWTPayload {
  exp: number;
  iat?: number;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
    axios.defaults.headers.common["Authorization"] = "";
    if (logoutTimer) clearTimeout(logoutTimer);
    window.dispatchEvent(new Event("userLogout"));
  };

  const setupAutoLogout = (token: string) => {
    try {
      const decoded: JWTPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        return;
      }

      const timeLeft = (decoded.exp - currentTime) * 1000;

      if (logoutTimer) clearTimeout(logoutTimer);

      const timer = setTimeout(() => {
        console.warn("JWT expired, auto logging out user...");
        logout();
      }, timeLeft);

      setLogoutTimer(timer);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      logout();
    }
  };

  useEffect(() => {
    const restoreUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === "admin");
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          setupAutoLogout(token);
        } catch (err) {
          console.error("Error restoring user:", err);
          logout();
        }
      } else {
        logout();
      }

      setLoading(false);
    };

    restoreUser();

    window.addEventListener("userLogin", restoreUser);
    window.addEventListener("userLogout", restoreUser);
    window.addEventListener("userUpdate", restoreUser);

    return () => {
      window.removeEventListener("userLogin", restoreUser);
      window.removeEventListener("userLogout", restoreUser);
      window.removeEventListener("userUpdate", restoreUser);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
