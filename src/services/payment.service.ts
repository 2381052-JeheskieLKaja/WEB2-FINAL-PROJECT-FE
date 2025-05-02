import AxiosInstance from "../utils/AxiosInstance";
import { PembayaranTiket } from "../types/PembayaranTiket";

const API_PAYMENT_ENDPOINT = "/pembayaran-tiket";

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

export const fetchPayments = async (): Promise<PembayaranTiket[]> => {
  try {
    const response = await AxiosInstance.get<PembayaranTiket[]>(
      API_PAYMENT_ENDPOINT,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const createPayment = async (
  paymentData: Partial<PembayaranTiket>
): Promise<PembayaranTiket> => {
  try {
    const response = await AxiosInstance.post<PembayaranTiket>(
      API_PAYMENT_ENDPOINT,
      paymentData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const updatePayment = async (
  id: number,
  paymentData: Partial<PembayaranTiket>
): Promise<PembayaranTiket> => {
  try {
    const response = await AxiosInstance.put<PembayaranTiket>(
      `${API_PAYMENT_ENDPOINT}/${id}`,
      paymentData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (id: number): Promise<boolean> => {
  try {
    await AxiosInstance.delete(`${API_PAYMENT_ENDPOINT}/${id}`, {
      headers: getHeaders()
    });
    return true;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
