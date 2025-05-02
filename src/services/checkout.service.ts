import AxiosInstance from "../utils/AxiosInstance";
import { Checkout, CreateCheckoutPayload } from "../types/Checkout";

const API_CHECKOUT_ENDPOINT = "/checkout";

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

export const fetchCheckouts = async (): Promise<Checkout[]> => {
  try {
    const response = await AxiosInstance.get<Checkout[]>(
      API_CHECKOUT_ENDPOINT,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    throw error;
  }
};

export const createCheckout = async (
  checkoutData: CreateCheckoutPayload
): Promise<Checkout> => {
  try {
    const response = await AxiosInstance.post<Checkout>(
      API_CHECKOUT_ENDPOINT,
      checkoutData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};

export const updateCheckout = async (
  id: number,
  checkoutData: CreateCheckoutPayload
): Promise<Checkout> => {
  try {
    const response = await AxiosInstance.put<Checkout>(
      `${API_CHECKOUT_ENDPOINT}/${id}`,
      checkoutData,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating checkout:", error);
    throw error;
  }
};

export const deleteCheckout = async (id: number): Promise<boolean> => {
  try {
    await AxiosInstance.delete(`${API_CHECKOUT_ENDPOINT}/${id}`, {
      headers: getHeaders()
    });
    return true;
  } catch (error) {
    console.error("Error deleting checkout:", error);
    throw error;
  }
};
