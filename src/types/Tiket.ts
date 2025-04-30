// src/types/Tiket.ts - UPDATE THIS FILE

// Definisi Tiket (contoh - sesuaikan dengan respons API Anda)
export type Tiket = {
  id: number;
  nama: string;     // Updated field
  lokasi: string;   // Updated field
  tanggal: string;  // Assuming ISO string from backend
  harga: number;    // Updated field
  stok: number;     // Updated field
  createdAt?: string; // Optional fields from backend
  updatedAt?: string; // Optional fields from backend
  // Tambahkan field lain jika ada
};

// Definisi TiketInput - UPDATE THIS TO MATCH THE FORM
export type TiketInput = {
  nama: string;
  lokasi: string;
  tanggal: string; // Expecting ISO String format when sending
  harga: number;
  stok: number;
  // Tambahkan field lain yang API Anda terima untuk create/update
};