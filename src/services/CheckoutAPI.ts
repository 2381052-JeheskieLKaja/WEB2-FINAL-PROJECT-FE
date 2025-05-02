// src/services/CheckoutAPI.ts
import axios from "axios";
import { Checkout } from "../types/Checkout";

const API_URL = "http://localhost:3000/api";

export const fetchCheckouts = async (): Promise<Checkout[]> => {
  const response = await axios.get(`${API_URL}/checkout`);
  return response.data;
};

export const createCheckout = async (data: {
  pembayaranId: number;
  total_harga: number;
}): Promise<Checkout> => {
  const response = await axios.post(`${API_URL}/checkout`, data);
  return response.data;
};

export const updateCheckout = async (
  id: number,
  data: { pembayaranId: number; total_harga: number }
): Promise<Checkout> => {
  const response = await axios.put(`${API_URL}/checkout/${id}`, data);
  return response.data;
};

export const deleteCheckout = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/checkout/${id}`);
};

export const fetchCheckoutByPaymentId = async (
  paymentId: number,
  token: string
): Promise<Checkout> => {
  const response = await axios.get(
    `${API_URL}/checkout/by-payment/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
