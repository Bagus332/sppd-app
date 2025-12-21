"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/api-client";

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
      // Use env variable or fallback
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.CHECK_AUTH}`, {
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

  // 🔹 Fungsi login
  const login = (data: any) => {
    setUser(data);
    setIsAuthenticated(true);
  };

  // 🔹 Fungsi logout
  const logout = async () => {
    console.log("Logout diklik");
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      await fetch(`${baseUrl}${API_ENDPOINTS.LOGOUT}`, {
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
