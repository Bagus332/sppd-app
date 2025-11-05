"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tambahkan isAuthenticated di interface
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (data: any) => void;
  logout: () => void;
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // 🔹 Cek token di localStorage setiap reload (biar tetap tahu status login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // 🔹 Fungsi login
  const login = (data: any) => {
    setUser(data);
    localStorage.setItem("token", data?.token || "");
    setIsAuthenticated(true);
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

      console.log("Menghapus token...");
      localStorage.removeItem("token");
      sessionStorage.clear();
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";

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
      login,
      logout,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom untuk akses AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
