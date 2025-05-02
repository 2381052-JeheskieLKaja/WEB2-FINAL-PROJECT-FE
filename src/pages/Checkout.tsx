// src/components/Checkout.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider"; // Adjust path
import {
  fetchCheckouts,
  createCheckout,
  updateCheckout,
  deleteCheckout
} from "../services/CheckoutAPI"; // Adjust path
import { Checkout as CheckoutType } from "../types/Checkout"; // Rename import to avoid conflict
import { fetchPayments } from "../services/payment.service";
import { PembayaranTiket } from "../types/PembayaranTiket";

const Checkout: React.FC = () => {
  const [checkouts, setCheckouts] = useState<CheckoutType[]>([]);
  const [payments, setPayments] = useState<PembayaranTiket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState<CheckoutType | null>(
    null
  );
  const [formData, setFormData] = useState({
    pembayaranId: "",
    total_harga: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { pembayaranId } = useParams<{ pembayaranId: string }>(); // Get ID from URL
  const { getToken } = useAuth();
  const token = getToken();

  // Parse the ID from string to number
  const paymentIdParam = pembayaranId ? parseInt(pembayaranId, 10) : undefined;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [checkoutsData, paymentsData] = await Promise.all([
        fetchCheckouts(),
        fetchPayments()
      ]);
      setCheckouts(checkoutsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    }
  };

  const handleAddClick = () => {
    setSelectedCheckout(null);
    setFormData({
      pembayaranId: "",
      total_harga: ""
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (checkout: CheckoutType) => {
    setSelectedCheckout(checkout);
    setFormData({
      pembayaranId: checkout.pembayaran.id.toString(),
      total_harga: checkout.total_harga.toString()
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this checkout?")) {
      try {
        await deleteCheckout(id);
        setCheckouts(checkouts.filter((checkout) => checkout.id !== id));
      } catch (error) {
        console.error("Error deleting checkout:", error);
        setError("Failed to delete checkout");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const checkoutData = {
        pembayaranId: parseInt(formData.pembayaranId),
        total_harga: parseInt(formData.total_harga)
      };

      if (selectedCheckout) {
        const updatedCheckout = await updateCheckout(
          selectedCheckout.id,
          checkoutData
        );
        setCheckouts(
          checkouts.map((checkout) =>
            checkout.id === updatedCheckout.id ? updatedCheckout : checkout
          )
        );
      } else {
        const newCheckout = await createCheckout(checkoutData);
        setCheckouts([...checkouts, newCheckout]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Determine error message, especially for 404
  let errorMessage = error;
  if ((error as any)?.response?.status === 404) {
    errorMessage = `Checkout details not found for Payment ID: ${paymentIdParam}. Please check the ID or contact support.`;
  }

  // == Render Logic ==

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (!paymentIdParam || isNaN(paymentIdParam)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <p className="text-xl font-semibold">
            Invalid Payment ID specified in the URL.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl font-semibold">
            Error loading checkout details
          </p>
          <p className="mt-2">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
        <button
          onClick={handleAddClick}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Add New Checkout
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-400 text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {checkouts.map((checkout) => (
              <tr key={checkout.id}>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {checkout.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {checkout.pembayaran.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  Rp {checkout.total_harga.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(checkout)}
                    className="text-gray-400 hover:text-gray-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(checkout.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border border-gray-600 w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white">
                {selectedCheckout ? "Edit Checkout" : "Add New Checkout"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Payment
                  </label>
                  <select
                    name="pembayaranId"
                    value={formData.pembayaranId}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  >
                    <option value="">Select Payment</option>
                    {payments.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        Payment #{payment.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Total Price
                  </label>
                  <input
                    type="number"
                    name="total_harga"
                    value={formData.total_harga}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 disabled:bg-gray-900"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
