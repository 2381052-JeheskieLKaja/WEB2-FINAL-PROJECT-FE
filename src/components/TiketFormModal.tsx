// src/components/TiketFormModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tiket, TiketInput } from "../types/Tiket";

interface TiketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TiketInput) => Promise<void>;
  initialData?: Tiket | null;
  isLoading: boolean;
  apiError: string | null;
}

// --- Animation Variants (keep as they are) ---
const backdropVariants = {
  /* ... */
};
const modalVariants = {
  /* ... */
};

// Helper to get default form data structure
const getDefaultFormData = (): TiketInput => ({
  nama: "",
  lokasi: "",
  tanggal: new Date().toISOString(),
  harga: 0,
  stok: 0
});

const TiketFormModal: React.FC<TiketFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  apiError
}) => {
  // Initialize state with default structure matching TiketInput
  const [formData, setFormData] = React.useState<TiketInput>(
    getDefaultFormData()
  );

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form for editing, ensuring correct types for state
        setFormData({
          nama: initialData.nama || "",
          lokasi: initialData.lokasi || "",
          tanggal: initialData.tanggal || new Date().toISOString(),
          harga: initialData.harga || 0,
          stok: initialData.stok || 0
        });
      } else {
        // Reset to defaults when opening for creation
        setFormData(getDefaultFormData());
      }
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : Number(value)
          : type === "datetime-local"
          ? new Date(value).toISOString()
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to perform this action");
      return;
    }

    // --- Validation ---
    const errors: string[] = [];
    if (!formData.nama) errors.push("Name is required.");
    if (!formData.lokasi) errors.push("Location is required.");
    if (!formData.tanggal) errors.push("Date & Time is required.");
    if (formData.harga < 0) errors.push("Price must be 0 or greater.");
    if (formData.stok < 0 || !Number.isInteger(formData.stok))
      errors.push("Stock must be a whole number 0 or greater.");

    if (errors.length > 0) {
      alert("Please fix the following errors:\n- " + errors.join("\n- "));
      return;
    }

    try {
      await onSubmit(formData);
      // Refresh the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {initialData ? "Edit Ticket" : "Create New Ticket"}
            </h2>
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Location Input */}
              <div className="mb-4">
                <label
                  htmlFor="lokasi"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Date & Time Input */}
              <div className="mb-4">
                <label
                  htmlFor="tanggal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal.slice(0, 16)}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Price & Stock Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="harga"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stok"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stok"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  ) : initialData ? (
                    "Update Ticket"
                  ) : (
                    "Create Ticket"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TiketFormModal;
