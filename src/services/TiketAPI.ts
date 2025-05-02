// src/services/TiketAPI.ts
import AxiosInstance from "../utils/AxiosInstance";
import { Tiket, TiketInput } from "../types/Tiket";

const API_TIKET_ENDPOINT = "/tiket";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to get headers with auth token
const getHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// PUT update ticket (Signature disederhanakan - tanpa token jika pakai interceptor)
export const updateTicket = async (
  id: number,
  ticketData: TiketInput
): Promise<Tiket> => {
  try {
    const response = await AxiosInstance.put<Tiket>(
      `${API_TIKET_ENDPOINT}/${id}`,
      ticketData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// GET fetch tickets (Signature disederhanakan - tanpa token jika pakai interceptor)
export const fetchTickets = async (): Promise<Tiket[]> => {
  try {
    const response = await AxiosInstance.get<Tiket[]>(API_TIKET_ENDPOINT, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// --- Fungsi lain (createTicket, deleteTicket) juga perlu disesuaikan ---

// Contoh createTicket (jika pakai interceptor)
export const createTicket = async (ticketData: TiketInput): Promise<Tiket> => {
  try {
    const response = await AxiosInstance.post<Tiket>(
      API_TIKET_ENDPOINT,
      ticketData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// Contoh deleteTicket (jika pakai interceptor)
export const deleteTicket = async (id: number): Promise<boolean> => {
  try {
    await AxiosInstance.delete(`${API_TIKET_ENDPOINT}/${id}`, {
      headers: getHeaders()
    });
    return true;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};
