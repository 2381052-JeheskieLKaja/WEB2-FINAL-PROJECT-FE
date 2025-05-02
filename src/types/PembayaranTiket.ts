// src/types/PembayaranTiket.ts
export interface PembayaranTiket {
  id: number;
  userId: number;
  tiketId: number;
  user?: {
    id: number;
    nama: string;
    email: string;
  };
  tiket?: {
    id: number;
    nama: string;
    lokasi: string;
    tanggal: string;
    harga: number;
  };
  checkout?: {
    id: number;
    tanggal: string;
    total_harga: number;
  };
  created_at: string;
  updated_at: string;
}
