"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tambahkan isAuthenticated di interface
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => void;
  logout: () => void;
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 🔹 Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/check', {
        credentials: 'include', // Send httpOnly cookie
      });
      const data = await response.json();
      if (data.loggedIn) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fungsi login - rely on httpOnly cookie from backend
  const login = (data: any) => {
    setUser(data);
    setIsAuthenticated(true);
    // Backend already set httpOnly cookie, no need for localStorage
  };

  // 🔹 Fungsi logout
  const logout = async () => {
    console.log("Logout diklik");
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;

    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setIsAuthenticated(false);

      console.log("Berhasil logout, mengarahkan ke halaman login...");
      router.push("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  // Gunakan useMemo agar value tidak berubah setiap render
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom untuk akses AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
