// src/utils/AuthProvider.tsx

import React, { createContext, ReactNode, useContext, useState } from "react";

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
  register: (data: RegisterInput) => Promise<void>; // Promise void karena login internal yg update state
};

// --- API Endpoint (Ganti dengan URL endpoint Anda yang sebenarnya) ---
const API_REGISTER_ENDPOINT = "/api/auth/register"; // Contoh

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Cek token saat inisialisasi provider
    const token = localStorage.getItem("token");
    // Di sini Anda mungkin ingin menambahkan validasi token (misalnya cek expired) jika memungkinkan
    return !!token;
  });

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

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // --- Implementasi Fungsi Register ---
  const register = async (data: RegisterInput): Promise<void> => {
    try {
      const response = await fetch(API_REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json(); // Coba parse JSON terlepas dari status

      if (!response.ok) {
        // Jika ada pesan error dari backend, gunakan itu
        const errorMessage = responseData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(`Registration failed: ${errorMessage}`);
      }

      // --- Handling Sukses ---
      // Asumsi API mengembalikan token jika registrasi berhasil & langsung login
      if (responseData && responseData.token) {
        console.log("Registration successful, logging in...");
        login(responseData.token); // Gunakan fungsi login internal
      } else {
        // Jika API tidak mengembalikan token (misalnya perlu verifikasi email dulu)
        console.log("Registration successful, but no token returned. Please log in manually or verify your email.");
        // Anda mungkin tidak ingin melakukan apa-apa di sini, atau mungkin set state tertentu
        // Tergantung alur aplikasi Anda
      }

    } catch (error) {
      console.error("Registration error:", error);
      // Lemparkan ulang error agar komponen pemanggil bisa menanganinya
      // (misalnya menampilkan pesan error di form registrasi)
      if (error instanceof Error) {
         throw new Error(`Registration failed: ${error.message}`);
      } else {
         throw new Error("An unknown registration error occurred.");
      }
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
        register, // Tambahkan register ke value provider
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