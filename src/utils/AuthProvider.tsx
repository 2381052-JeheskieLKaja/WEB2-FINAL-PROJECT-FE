// src/utils/AuthProvider.tsx

import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  RegisterData,
  LoginData,
  AuthResponse
} from "../services/auth.service";

// Tipe data untuk input registrasi (sesuaikan dengan kebutuhan API Anda)
type RegisterInput = {
  email: string; // Atau username
  password: string;
  // Tambahkan field lain jika perlu (misal: name, etc.)
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  // Tambahkan fungsi register ke tipe context
  register: (data: RegisterData) => Promise<void>; // Promise void karena login internal yg update state
};

// --- API Endpoint (Ganti dengan URL endpoint Anda yang sebenarnya) ---
const API_REGISTER_ENDPOINT = "/api/auth/register"; // Contoh

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    // Di sini Anda mungkin ingin memuat data pengguna setelah login
    // Misalnya: fetchUserProfile();
    console.log("User logged in");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Di sini Anda mungkin ingin membersihkan data pengguna
    console.log("User logged out");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // --- Implementasi Fungsi Register ---
  const register = async (data: RegisterData): Promise<void> => {
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  // --- Akhir Implementasi Fungsi Register ---

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        getToken,
        register // Tambahkan register ke value provider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
