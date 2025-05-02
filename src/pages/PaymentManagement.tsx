import { useState, useEffect } from "react";
import { fetchPayments, createPayment } from "../services/payment.service";
import { fetchTickets } from "../services/TiketAPI";
import { PembayaranTiket } from "../types/PembayaranTiket";
import { Tiket } from "../types/Tiket";
import { jwtDecode } from "jwt-decode";

export default function PaymentManagement() {
  const [payments, setPayments] = useState<PembayaranTiket[]>([]);
  const [tickets, setTickets] = useState<Tiket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPaymentsData();
    fetchTicketsData();
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.sub) {
        setCurrentUserId(Number(decodedToken.sub));
      }
    }
  }, []);

  const fetchPaymentsData = async () => {
    try {
      const data = await fetchPayments();
      setPayments(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketsData = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets");
    }
  };

  const handleCreatePayment = async (ticketId: number) => {
    if (!currentUserId) {
      setError("User not authenticated");
      return;
    }

    try {
      const paymentData = {
        userId: currentUserId,
        tiketId: ticketId
      };
      const newPayment = await createPayment(paymentData);
      setPayments((prev) => [...prev, newPayment]);
      setError("");
      setIsAdding(false);
      setSelectedTicketId(null);
    } catch (err) {
      setError("Failed to create payment");
    }
  };

  const handleAddClick = () => {
    setSelectedTicketId(null);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setSelectedTicketId(null);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Add New Payment
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Payment</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Ticket
              </label>
              <select
                value={selectedTicketId || ""}
                onChange={(e) => setSelectedTicketId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a ticket</option>
                {tickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.nama} -{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR"
                    }).format(ticket.harga)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedTicketId) {
                    handleCreatePayment(selectedTicketId);
                  } else {
                    setError("Please select a ticket");
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Payment #{payment.id}
              </h3>
            </div>

            <div className="space-y-2">
              {payment.user && (
                <p className="text-gray-600">
                  <span className="font-medium">User:</span> {payment.user.nama}
                </p>
              )}
              {payment.tiket && (
                <>
                  <p className="text-gray-600">
                    <span className="font-medium">Ticket:</span>{" "}
                    {payment.tiket.nama}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Amount:</span>{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR"
                    }).format(payment.tiket.harga)}
                  </p>
                </>
              )}
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(payment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
