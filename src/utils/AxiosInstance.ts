// src/utils/AxiosInstance.ts
import axios, { AxiosError } from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Optional: Request Interceptor (misal: menambahkan token otomatis jika disimpan di local storage)
// AxiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken'); // Contoh
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Response Interceptor untuk Error Handling
AxiosInstance.interceptors.response.use(
  response => response, // Biarkan response sukses lolos
  (error: AxiosError) => {
    // Tangani error spesifik di sini jika perlu (misal: refresh token untuk 401)
    console.error("API Call Error:", error.response?.status, error.message);
    // Anda bisa melempar ulang error agar bisa ditangkap di pemanggilan API,
    // atau mengembalikan objek error yang sudah diproses.
    // Contoh sederhana:
    if (error.response) {
       // Server merespons dengan status code di luar 2xx
       // Tampilkan notifikasi error global atau lakukan redirect
       if (error.response.status === 401) {
          // Redirect ke login atau coba refresh token
          console.error("Unauthorized access - Redirecting to login...");
          // window.location.href = '/login'; // Contoh redirect
       }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons diterima
      console.error("API No Response:", error.request);
    } else {
      // Sesuatu terjadi saat setup request
      console.error("API Request Setup Error:", error.message);
    }
    // Lempar ulang error agar bisa ditangani secara spesifik jika perlu
    return Promise.reject(error);
  }
);


export default AxiosInstance;