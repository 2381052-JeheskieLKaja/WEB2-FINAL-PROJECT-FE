// src/types/PembayaranTiket.ts (adjust based on your actual entity)
export interface PembayaranTiket {
    id: number;
    jumlah_tiket: number;
    total_harga: number;
    metode_pembayaran: string; // e.g., 'Credit Card', 'Bank Transfer'
    status_pembayaran: string; // e.g., 'PENDING', 'SUCCESS', 'FAILED'
    created_at?: string | Date;
    updated_at?: string | Date;
    // Add relation to Tiket if it exists and is needed for display
    // tiket?: Tiket;
    // Add relation to User if needed
    // user?: User;
  }