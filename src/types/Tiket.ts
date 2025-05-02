// src/types/Tiket.ts - UPDATE THIS FILE

// Definisi Tiket (contoh - sesuaikan dengan respons API Anda)
export type Tiket = {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string; // ISO string format
  harga: number;
  stok: number;
  created_at?: string;
  updated_at?: string;
  // Tambahkan field lain jika ada
};

// Definisi TiketInput - UPDATE THIS TO MATCH THE FORM
export type TiketInput = {
  nama: string;
  lokasi: string;
  tanggal: string; // ISO string format
  harga: number;
  stok: number;
  // Tambahkan field lain yang API Anda terima untuk create/update
};
