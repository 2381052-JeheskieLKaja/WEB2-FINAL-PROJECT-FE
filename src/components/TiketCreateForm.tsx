// src/components/TiketCreateForm.tsx (Renamed for clarity)

import React from "react"; // Removed useState, useEffect as they are no longer needed for this scope
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../utils/AuthProvider"; // <--- Import useAuth

import { createTicket, TiketPayload } from "../services/TiketAPI"; // Adjust path, only import createTicket
import { Tiket } from "../types/Tiket"; // Adjust path
import "../styles/Tiket.css"; // Adjust path if needed

// Helper to format datetime-local string to ISO string for backend
const formatDateForAPI = (localDateTime?: string): string | undefined => {
  if (!localDateTime) return undefined;
  try {
    const date = new Date(localDateTime);
    if (isNaN(date.getTime())) throw new Error("Invalid date input");
    return date.toISOString(); // Convert to ISO string (UTC)
  } catch (e) {
    console.error("Error formatting date for API:", localDateTime, e);
    return undefined; // Or throw error to prevent submission
  }
};

// Form input type - Omit fields not directly in the form/payload if needed
interface TiketFormInputs extends Omit<TiketPayload, "tanggal"> {
  tanggal: string; // Keep tanggal as string for datetime-local input
}

// Renamed component to reflect its specific purpose
function TiketCreateForm() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const token = getToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
    setError // Import setError to manually set form errors if needed
  } = useForm<TiketFormInputs>({
    defaultValues: {
      nama: "",
      lokasi: "",
      tanggal: "",
      harga: 0,
      stok: 0,
    },
  });

  // == React Query: Create Ticket Mutation ==
  const createMutation = useMutation<Tiket, Error, TiketPayload>({
    mutationFn: (newTicketData) => {
      // Check token inside the mutation function before making the call
      const currentToken = getToken(); // Re-fetch token in case it expired/changed
      if (!currentToken) {
        // You might want to redirect to login or show a persistent error
        return Promise.reject(new Error("Authentication token is missing or invalid. Please log in again."));
      }
      return createTicket(newTicketData, currentToken);
    },
    onSuccess: (newTicket) => {
      // Optionally invalidate related queries if other parts of the app display tickets
      // queryClient.invalidateQueries({ queryKey: ['tickets'] }); // General invalidation if needed elsewhere
      alert(`Ticket "${newTicket.nama}" created successfully!`);
      reset(); // Reset form after successful creation
    },
    onError: (error) => {
      console.error("Create Ticket Error:", error);
      // Provide more specific feedback if possible (e.g., based on error status code)
      alert(`Failed to create ticket: ${error.message}`);
    },
  });

  // Simplified form reset handler
  const handleResetForm = () => {
    reset();
  };

  // == Form Submission Logic ==
  const onSubmit: SubmitHandler<TiketFormInputs> = (formData) => {
    const currentToken = getToken(); // Get fresh token check before submitting
    if (!currentToken) {
      alert("Authentication error. Please log in again.");
      // Consider redirecting to login page here
      return;
    }

    const apiFormattedDate = formatDateForAPI(formData.tanggal);

    // Validate date conversion
    if (formData.tanggal && !apiFormattedDate) {
      setError("tanggal", { type: "manual", message: "Invalid date format provided." });
      return;
    }
    if (!apiFormattedDate) { // Assuming date is required
        setError("tanggal", { type: "manual", message: "Date and time are required." });
        return;
    }

    // Prepare payload for the API
    const payload: TiketPayload = {
      nama: formData.nama,
      lokasi: formData.lokasi,
      harga: Number(formData.harga) || 0, // Ensure it's a number
      stok: Number(formData.stok) || 0,   // Ensure it's a number
      tanggal: apiFormattedDate,           // Use the ISO formatted date string
    };

    // Trigger the mutation
    createMutation.mutate(payload);
  };

  // Consolidate loading states (only creation mutation matters now)
  const isLoading = isSubmitting || createMutation.isPending;

  // Error state (only creation mutation matters now)
  const displayError = createMutation.error;

  // == Render ==
  return (
    <div className="tiket-app-container"> {/* Keep container or adjust as needed */}
      <h1>Create New Ticket</h1>

      {/* Auth Status/Error */}
      {!token && (
        <div className="status-message error">
          Please log in to create tickets.
        </div>
      )}

      {/* Display Create Errors */}
      {displayError && (
        <div className="status-message error">
          Error creating ticket: {displayError.message}
        </div>
      )}

      {/* --- Create Form (Only render if token exists) --- */}
      {token && (
        <div className="tiket-form-container">
          {/* Form title is static now */}
          <h2 className="form-title">Enter Ticket Details</h2>
          <form className="tiket-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Nama Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="nama">Name:</label>
              <input
                type="text"
                id="nama"
                className={`form-input ${formErrors.nama ? "input-error" : ""}`}
                {...register("nama", { required: "Ticket name is required" })}
                disabled={isLoading}
              />
              {formErrors.nama && (
                <p className="error-message">{formErrors.nama.message}</p>
              )}
            </div>

            {/* Lokasi Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="lokasi">Location:</label>
              <input
                type="text"
                id="lokasi"
                className={`form-input ${formErrors.lokasi ? "input-error" : ""}`}
                {...register("lokasi", { required: "Location is required" })}
                disabled={isLoading}
              />
              {formErrors.lokasi && (
                <p className="error-message">{formErrors.lokasi.message}</p>
              )}
            </div>

            {/* Tanggal Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="tanggal">Date & Time:</label>
              <input
                type="datetime-local"
                id="tanggal"
                className={`form-input ${formErrors.tanggal ? "input-error" : ""}`}
                {...register("tanggal", { required: "Date and time are required" })}
                disabled={isLoading}
              />
              {formErrors.tanggal && (
                <p className="error-message">{formErrors.tanggal.message}</p>
              )}
            </div>

            {/* Harga Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="harga">Price:</label>
              <input
                type="number"
                id="harga"
                className={`form-input ${formErrors.harga ? "input-error" : ""}`}
                min="0"
                step="0.01"
                {...register("harga", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                disabled={isLoading}
              />
              {formErrors.harga && (
                <p className="error-message">{formErrors.harga.message}</p>
              )}
            </div>

            {/* Stok Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="stok">Stock:</label>
              <input
                type="number"
                id="stok"
                className={`form-input ${formErrors.stok ? "input-error" : ""}`}
                min="0"
                step="1" // Integer steps
                {...register("stok", {
                  required: "Stock is required",
                  valueAsNumber: true, // Process value as number
                  validate: value => Number.isInteger(value) || "Stock must be a whole number", // Ensure integer
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
                disabled={isLoading}
              />
              {formErrors.stok && (
                <p className="error-message">{formErrors.stok.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="submit"
                className="form-button"
                disabled={isLoading || !token} // Disable if loading or no token
              >
                {isLoading ? "Saving..." : "Create Ticket"}
              </button>
              {/* Add a reset button if desired */}
               <button
                   type="button"
                   className="form-button cancel-button" // Style as needed
                   onClick={handleResetForm}
                   disabled={isLoading}
               >
                   Reset Form
               </button>
            </div>
          </form>
        </div>
      )}

      {/* --- Ticket List Section Removed --- */}
    </div>
  );
}

// Export the renamed component
export default TiketCreateForm;