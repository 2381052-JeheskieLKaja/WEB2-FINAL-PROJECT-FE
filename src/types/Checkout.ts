// src/types/Checkout.ts
import { PembayaranTiket } from './PembayaranTiket'; // Adjust path

export interface Checkout {
  id: number;
  tanggal: string | Date; // API might send string (ISO), Date object after parsing
  total_harga: number;
  created_at: string | Date;
  updated_at: string | Date;
  pembayaran: PembayaranTiket; // Nested payment details
}

// Type for the API payload if you were *creating* a checkout
// (Not used in this display-focused component, but good to have)
export interface CreateCheckoutPayload {
    pembayaranId: number;
}