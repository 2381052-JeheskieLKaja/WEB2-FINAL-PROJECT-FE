// src/services/CheckoutAPI.ts
import AxiosInstance from "../utils/AxiosInstance"; // Adjust path
import { Checkout } from "../types/Checkout"; // Adjust path

const API_CHECKOUT_ENDPOINT = "/api/checkout"; // Base path for checkout API

// --- Helper to create auth headers ---
const createAuthHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
});

/**
 * Fetches a checkout record by its associated PembayaranTiket ID.
 */
export const fetchCheckoutByPaymentId = async (
    pembayaranId: number,
    token: string
): Promise<Checkout> => {
    if (!pembayaranId) {
        throw new Error("Payment ID is required to fetch checkout details.");
    }
    const response = await AxiosInstance.get<Checkout>(
        `${API_CHECKOUT_ENDPOINT}/by-payment/${pembayaranId}`, // Use the specific endpoint
        {
            headers: createAuthHeaders(token),
        }
    );
    return response.data;
};

// --- Add other functions if needed (e.g., createCheckout) ---
/*
import { CreateCheckoutPayload } from '../types/Checkout'; // Assuming you define this

export const createCheckout = async (
    payload: CreateCheckoutPayload,
    token: string
): Promise<Checkout> => {
    const response = await AxiosInstance.post<Checkout>(
        API_CHECKOUT_ENDPOINT,
        payload,
        {
             headers: createAuthHeaders(token),
        }
    );
    return response.data;
}
*/