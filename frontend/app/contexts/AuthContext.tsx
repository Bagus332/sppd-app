"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

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
      const data = await apiClient.get<{ loggedIn: boolean; userId?: number }>(API_ENDPOINTS.CHECK_AUTH);
      if (data.loggedIn) {
        setIsAuthenticated(true);
        // data might contain userId, but we might need more user info. 
        // For now, consistent with previous logic:
        // setUser({ id: data.userId }); // Optional: if checkAuth returns user details
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
      await apiClient.post(API_ENDPOINTS.LOGOUT);

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
