// src/services/TiketAPI.ts
import AxiosInstance from "../utils/AxiosInstance";
import { Tiket, TiketInput } from "../types/Tiket";

const API_TIKET_ENDPOINT = "/api/tiket";

// PUT update ticket (Signature disederhanakan - tanpa token jika pakai interceptor)
export const updateTicket = async (
    id: number,
    data: TiketInput
): Promise<Tiket | null> => { // Kembalikan null jika error
    try {
        // --- PERBAIKAN URL di sini ---
        const response = await AxiosInstance.put<Tiket>(
            `${API_TIKET_ENDPOINT}/${id}`, // Gunakan template literal
            data
            // Tidak perlu header jika interceptor menangani token
        );
        return response.data;
    } catch (error) {
        // Interceptor mungkin sudah log error, tapi log spesifik di sini bisa membantu debugging
        console.error(`Error updating ticket ${id}:`, error);
        return null; // Sinyalkan kegagalan ke pemanggil
    }
};

// GET fetch tickets (Signature disederhanakan - tanpa token jika pakai interceptor)
export const fetchTickets = async (): Promise<Tiket[] | null> => {
    try {
        const response = await AxiosInstance.get<Tiket[]>(API_TIKET_ENDPOINT);
         // Tidak perlu header jika interceptor menangani token
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return null;
    }
};

// --- Fungsi lain (createTicket, deleteTicket) juga perlu disesuaikan ---

// Contoh createTicket (jika pakai interceptor)
export const createTicket = async (data: TiketInput): Promise<Tiket | null> => {
    try {
        const response = await AxiosInstance.post<Tiket>(API_TIKET_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error("Error creating ticket:", error);
        return null;
    }
};

// Contoh deleteTicket (jika pakai interceptor)
export const deleteTicket = async (id: number): Promise<boolean> => { // Kembalikan boolean untuk sukses/gagal
    try {
        await AxiosInstance.delete(`${API_TIKET_ENDPOINT}/${id}`);
        return true; // Sukses
    } catch (error) {
        console.error(`Error deleting ticket ${id}:`, error);
        return false; // Gagal
    }
};