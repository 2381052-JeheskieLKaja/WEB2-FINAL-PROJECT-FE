// src/pages/TicketAdmin.tsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TiketItem from "../components/TiketItem"; // Adjust path if needed
import TiketFormModal from "../components/TiketFormModal"; // Adjust path if needed
import * as tiketApi from "../services/TiketAPI"; // Adjust path if needed
import { Tiket, TiketInput } from "../types/Tiket"; // Adjust path if needed
import { useAuth } from "../utils/AuthProvider"; // <-- Import your auth hook

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Renamed function component
function TicketAdmin() {
  const { getToken } = useAuth(); // <-- Get token from AuthProvider context

  const authToken = getToken();

  const [tikets, setTikets] = useState<Tiket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTiket, setEditingTiket] = useState<Tiket | null>(null);

  // No longer need local token state or input handlers

  const fetchData = useCallback(async () => {
    if (!authToken) {
      setError("Authentication required to view tickets.");
      setTikets([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await tiketApi.fetchTickets();
      setTikets(data || []);
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err);
      setError(err.message || "Failed to fetch tickets.");
      setTikets([]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch when token changes

  const handleOpenCreateForm = () => {
    setEditingTiket(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (tiket: Tiket) => {
    setEditingTiket(tiket);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTiket(null);
    setFormError(null);
  };

  const handleFormSubmit = async (data: TiketInput) => {
    if (!authToken) {
      setFormError("Authentication required to save ticket.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      let savedTiket: Tiket | null;
      if (editingTiket) {
        savedTiket = await tiketApi.updateTicket(editingTiket.id, data);
        if (savedTiket) {
          setTikets((prev) =>
            prev.map((t) => (t.id === savedTiket!.id ? savedTiket! : t))
          );
        }
      } else {
        savedTiket = await tiketApi.createTicket(data);
        if (savedTiket) {
          setTikets((prev) => [...prev, savedTiket!]);
        }
      }
      handleCloseForm();
    } catch (err: any) {
      console.error("Failed to save ticket:", err);
      setFormError(err.message || "Failed to save ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!authToken) {
      setError("Authentication required to delete ticket.");
      return;
    }
    setIsDeletingId(id);
    setError(null);
    try {
      await tiketApi.deleteTicket(id);
      setTikets((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(`Failed to delete ticket ${id}:`, err);
      setError(err.message || `Failed to delete ticket ${id}.`);
      if (err.message?.includes("Unauthorized")) {
        setError("Unauthorized. Please check your login session.");
      }
    } finally {
      setIsDeletingId(null);
    }
  };

  // --- Render Logic ---

  // Optional: Show message if not authenticated
  if (!authToken) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          Ticket Management
        </h1>
        <p className="text-center text-red-600">
          Please log in to manage tickets.
        </p>
        {/* Optionally add a link to the login page */}
      </div>
    );
  }

  return (
    // Removed outer div if RootLayout provides container/padding
    // <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
        Ticket Management
      </h1>

      {/* Removed the token input section */}

      <div className="flex justify-end mb-4">
        {/* Button is now enabled/disabled based on token from context */}
        <button
          onClick={handleOpenCreateForm}
          disabled={!authToken}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add New Ticket
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading tickets...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && tikets.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No tickets found.</p>
      )}

      {!isLoading && tikets.length > 0 && (
        <motion.ul variants={listVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            {tikets.map((tiket) => (
              <motion.div
                key={tiket.id}
                layout
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              >
                <TiketItem
                  tiket={tiket}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDelete}
                  isDeleting={isDeletingId === tiket.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <TiketFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingTiket}
        isLoading={isSubmitting}
        apiError={formError}
      />
    </>
    // </div>
  );
}

export default TicketAdmin; // Export the renamed component
