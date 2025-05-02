import React, { useState, useEffect } from "react";
import {
  fetchCheckouts,
  createCheckout,
  updateCheckout,
  deleteCheckout
} from "../services/checkout.service";
import { Checkout } from "../types/Checkout";
import { fetchPayments } from "../services/payment.service";
import { PembayaranTiket } from "../types/PembayaranTiket";

const CheckoutManagement: React.FC = () => {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [payments, setPayments] = useState<PembayaranTiket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState<Checkout | null>(
    null
  );
  const [formData, setFormData] = useState({
    pembayaranId: "",
    total_harga: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEditClick = (checkout: Checkout) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout Management</h1>
        <button
          onClick={handleAddClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Checkout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {checkouts.map((checkout) => (
              <tr key={checkout.id}>
                <td className="px-6 py-4 whitespace-nowrap">{checkout.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {checkout.pembayaran.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp {checkout.total_harga.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(checkout)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(checkout.id)}
                    className="text-red-600 hover:text-red-900"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCheckout ? "Edit Checkout" : "Add New Checkout"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment
                  </label>
                  <select
                    name="pembayaranId"
                    value={formData.pembayaranId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Payment</option>
                    {payments.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        Payment #{payment.id} - Rp{" "}
                        {payment.tiket?.harga.toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Price
                  </label>
                  <input
                    type="number"
                    name="total_harga"
                    value={formData.total_harga}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Saving..."
                      : selectedCheckout
                      ? "Update"
                      : "Create"}
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

export default CheckoutManagement;
