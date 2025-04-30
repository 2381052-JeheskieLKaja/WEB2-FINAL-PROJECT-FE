// src/components/TiketFormModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tiket, TiketInput } from '../types/Tiket'; // Make sure TiketInput matches form fields

interface TiketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TiketInput) => Promise<void>; // Expects the correct TiketInput
  initialData?: Tiket | null;
  isLoading: boolean;
  apiError: string | null;
}

// --- Animation Variants (keep as they are) ---
const backdropVariants = { /* ... */ };
const modalVariants = { /* ... */ };

// Helper to get default form data structure
const getDefaultFormData = (): TiketInput => ({
    nama: '',
    lokasi: '',
    // Initialize with current date/time formatted as ISO string for state
    tanggal: new Date().toISOString(),
    harga: 0,
    stok: 0,
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
  const [formData, setFormData] = React.useState<TiketInput>(getDefaultFormData());

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form for editing, ensuring correct types for state
        setFormData({
          nama: initialData.nama,
          lokasi: initialData.lokasi,
          // Ensure tanggal is stored as full ISO string in state
          tanggal: initialData.tanggal
            ? new Date(initialData.tanggal).toISOString() // Convert any incoming date format to ISO
            : new Date().toISOString(), // Fallback
          harga: initialData.harga,
          stok: initialData.stok,
        });
      } else {
        // Reset to defaults when opening for creation
        setFormData(getDefaultFormData());
      }
    }
    // Consider resetting form on close if desired
    // else {
    //   setFormData(getDefaultFormData());
    // }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number'
        // Handle potential empty string from number input if needed, otherwise convert
        ? (value === '' ? null : Number(value)) // Store null if empty, or the number
        : type === 'datetime-local'
          // Convert input's YYYY-MM-DDTHH:mm to full ISO string for state
          ? (value ? new Date(value).toISOString() : '') // Store ISO string or empty
          : value, // Handle text and other inputs
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // --- Refined Validation ---
    const errors: string[] = [];
    if (!formData.nama) errors.push("Name is required.");
    if (!formData.lokasi) errors.push("Location is required.");
    if (!formData.tanggal) errors.push("Date & Time is required.");
    // Check if null or not a number (covers initial null and potential NaN)
    if (formData.harga === null || isNaN(formData.harga) || formData.harga < 0) errors.push("Valid Price is required (must be 0 or greater).");
    if (formData.stok === null || isNaN(formData.stok) || formData.stok < 0 || !Number.isInteger(formData.stok) ) errors.push("Valid Stock is required (must be a whole number 0 or greater).");

    if (errors.length > 0) {
        alert("Please fix the following errors:\n- " + errors.join("\n- "));
        return;
    }
    // --- End Validation ---


    // Prepare data matching TiketInput type for the API
    // Ensure numbers are numbers (even if stored as null temporarily in state)
    const dataToSend: TiketInput = {
        nama: formData.nama,
        lokasi: formData.lokasi,
        tanggal: formData.tanggal, // Already ISO string from state
        harga: Number(formData.harga ?? 0), // Send 0 if it was null
        stok: Number(formData.stok ?? 0)   // Send 0 if it was null
    };

    await onSubmit(dataToSend);
    // Form might be closed by parent onSubmit handler on success
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* --- Backdrop (keep as is) --- */}
          <motion.div /* ... */ onClick={onClose} />

          {/* --- Modal --- */}
          <motion.div
             className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-md"
             variants={modalVariants}
             initial="hidden"
             animate="visible"
             exit="exit"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {initialData ? 'Edit Ticket' : 'Create New Ticket'}
            </h2>
            {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{apiError}</div>}

            {/* --- Form --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama ?? ''} // Use ?? '' for better empty state handling
                  onChange={handleChange}
                  // required // Basic HTML validation can be removed if using JS validation
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Location Input */}
               <div>
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  value={formData.lokasi ?? ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Date & Time Input */}
              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  id="tanggal"
                  name="tanggal"
                  // Format state's ISO string back to YYYY-MM-DDTHH:mm for input value
                  value={formData.tanggal ? formData.tanggal.slice(0, 16) : ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Price & Stock Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="harga" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga ?? ''} // Use ?? '' for better empty state handling
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder='e.g., 10.50'
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="stok" className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    id="stok"
                    name="stok"
                    value={formData.stok ?? ''} // Use ?? '' for better empty state handling
                    onChange={handleChange}
                    min="0"
                    step="1" // Integer
                    placeholder='e.g., 100'
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* --- Action Buttons --- */}
              <div className="flex justify-end space-x-3 pt-4">
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]" // Added alignment and min-width
                >
                  {isLoading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (initialData ? 'Update Ticket' : 'Create Ticket')}
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