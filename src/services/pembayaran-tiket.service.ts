import AxiosInstance from "../utils/AxiosInstance";
import { PembayaranTiket } from "../types/PembayaranTiket";

const API_PEMBAYARAN_ENDPOINT = "/pembayaran-tiket";

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

export const fetchPembayaranTiket = async (): Promise<PembayaranTiket[]> => {
  try {
    const response = await AxiosInstance.get<PembayaranTiket[]>(
      API_PEMBAYARAN_ENDPOINT,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pembayaran tiket:", error);
    throw error;
  }
};

export const createPembayaranTiket = async (
  data: Partial<PembayaranTiket>
): Promise<PembayaranTiket> => {
  try {
    const response = await AxiosInstance.post<PembayaranTiket>(
      API_PEMBAYARAN_ENDPOINT,
      data,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating pembayaran tiket:", error);
    throw error;
  }
};

export const updatePembayaranTiket = async (
  id: number,
  data: Partial<PembayaranTiket>
): Promise<PembayaranTiket> => {
  try {
    const response = await AxiosInstance.put<PembayaranTiket>(
      `${API_PEMBAYARAN_ENDPOINT}/${id}`,
      data,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating pembayaran tiket:", error);
    throw error;
  }
};

export const deletePembayaranTiket = async (id: number): Promise<boolean> => {
  try {
    await AxiosInstance.delete(`${API_PEMBAYARAN_ENDPOINT}/${id}`, {
      headers: getHeaders()
    });
    return true;
  } catch (error) {
    console.error("Error deleting pembayaran tiket:", error);
    throw error;
  }
};
