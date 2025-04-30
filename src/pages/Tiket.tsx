// src/components/TiketApp.tsx (or wherever you place it)

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../utils/AuthProvider"; // <--- Import useAuth

import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  TiketPayload,
} from "../services/TiketAPI"; // Adjust path
import { Tiket } from "../types/Tiket"; // Adjust path
import "../styles/Tiket.css"; // Adjust path if needed

// Helper functions (formatDateForInput, formatDateForAPI) remain the same...
// Helper to format ISO date string for datetime-local input
const formatDateForInput = (isoDate?: string | Date): string => {
  if (!isoDate) return "";
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ""; // Invalid date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date for input:", isoDate, e);
    return ""; // Fallback
  }
};

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

interface TiketFormInputs extends Omit<TiketPayload, "tanggal"> {
  tanggal: string;
}

function TiketApp() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth(); // <--- Get token from useAuth
  const token = getToken();

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const isEditing = selectedTicketId !== null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<TiketFormInputs>({
    defaultValues: {
      nama: "",
      lokasi: "",
      tanggal: "",
      harga: 0,
      stok: 0,
    },
  });

  // == React Query: Fetching Tickets ==
  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    error: fetchError,
    isFetching, // Use isFetching for background loading indicator
  } = useQuery<Tiket[], Error>({
    // Include token in the queryKey. React Query uses this for caching
    // and passes it to the queryFn.
    queryKey: ["tickets", token],
    // Pass the token from the queryKey to the API function
    queryFn: ({ queryKey }) => {
      const _token = queryKey[1] as string; // Get token from key
      if (!_token) {
        // Or return Promise.reject(new Error("Not authenticated"));
        return Promise.resolve([]); // Don't fetch if no token
      }
      return fetchTickets(_token);
    },
    // Only run the query if the token exists.
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Example: Cache data for 5 minutes
  });

  // == React Query: Create Ticket Mutation ==
  const createMutation = useMutation<Tiket, Error, TiketPayload>({
    // Wrap the API call to include the token from the component's scope
    mutationFn: (newTicketData) => {
      if (!token) return Promise.reject(new Error("Not authenticated"));
      return createTicket(newTicketData, token);
    },
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", token] }); // Invalidate with token
      alert("Ticket created successfully!");
      handleCancelEdit();
    },
    onError: (error) => {
      console.error("Create Ticket Error:", error);
      alert(`Failed to create ticket: ${error.message}`);
    },
  });

  // == React Query: Update Ticket Mutation ==
  const updateMutation = useMutation<
    Tiket,
    Error,
    { id: number; data: Partial<TiketPayload> }
  >({
    // Wrap the API call
    mutationFn: (updateData) => {
      if (!token) return Promise.reject(new Error("Not authenticated"));
      return updateTicket(updateData, token);
    },
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", token] }); // Invalidate with token
      alert("Ticket updated successfully!");
      handleCancelEdit();
    },
    onError: (error) => {
      console.error("Update Ticket Error:", error);
      alert(`Failed to update ticket: ${error.message}`);
    },
  });

  // == React Query: Delete Ticket Mutation ==
  const deleteMutation = useMutation<void, Error, number>({
    // Wrap the API call
    mutationFn: (id) => {
      if (!token) return Promise.reject(new Error("Not authenticated"));
      return deleteTicket(id, token);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["tickets", token] }); // Invalidate with token
      alert("Ticket deleted successfully!");
      if (selectedTicketId === deletedId) {
        handleCancelEdit();
      }
    },
    onError: (error) => {
      console.error("Delete Ticket Error:", error);
      alert(`Failed to delete ticket: ${error.message}`);
    },
  });

  // == Form Handling Logic ==
  const handleSelectTicket = (ticket: Tiket) => {
    setSelectedTicketId(ticket.id);
    reset({
      nama: ticket.nama,
      lokasi: ticket.lokasi,
      tanggal: formatDateForInput(ticket.tanggal),
      harga: ticket.harga,
      stok: ticket.stok,
    });
  };

  const handleCancelEdit = () => {
    setSelectedTicketId(null);
    reset();
  };

  const onSubmit: SubmitHandler<TiketFormInputs> = (formData) => {
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const apiFormattedDate = formatDateForAPI(formData.tanggal);
    if (formData.tanggal && !apiFormattedDate) {
      // Check if input was given but formatting failed
      alert("Invalid date format provided.");
      // Optionally set a specific form error:
      // setError("tanggal", { type: "manual", message: "Invalid date format." });
      return;
    }
    if (!apiFormattedDate) {
      // Handle case where date is required but missing/invalid
      alert("Date is required.");
      // setError("tanggal", { type: "manual", message: "Date is required." });
      return;
    }

    const payload: TiketPayload = {
      nama: formData.nama,
      lokasi: formData.lokasi,
      harga: Number(formData.harga) || 0,
      stok: Number(formData.stok) || 0,
      tanggal: apiFormattedDate, // Use the ISO formatted date string
    };

    if (isEditing && selectedTicketId) {
      updateMutation.mutate({ id: selectedTicketId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ticket ID: ${id}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Consolidate loading states
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const overallLoading =
    isLoadingTickets || isSubmitting || isMutating || isFetching; // Include isFetching for refetch indicator

  // Consolidate errors (fetch and mutation)
  const mutationError =
    createMutation.error || updateMutation.error || deleteMutation.error;
  const displayError = fetchError || mutationError;

  // == Render ==
  return (
    <div className="tiket-app-container">
      <h1>Ticket Management</h1>
      {/* Auth Status/Error */}
      {!token && (
        <div className="status-message error">
          Please log in to manage tickets.
        </div>
      )}
      {/* Display Loading States */}
      {isLoadingTickets && !tickets.length && (
        <div className="status-message loading">Loading initial tickets...</div>
      )}
      {isFetching && !isLoadingTickets && (
        <div className="status-message loading background">
          Checking for updates...
        </div>
      )}{" "}
      {/* Background refresh indicator */}
      {/* Display Errors */}
      {displayError && (
        <div className="status-message error">
          Error: {displayError.message}
        </div>
      )}
      {/* --- Create/Update Form (Only render if token exists) --- */}
      {token && (
        <div className="tiket-form-container">
          <h2 className="form-title">
            {isEditing
              ? `Edit Ticket (ID: ${selectedTicketId})`
              : "Create New Ticket"}
          </h2>
          <form className="tiket-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Input fields remain the same... */}
            {/* Nama Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="nama">
                Name:
              </label>
              <input
                type="text"
                id="nama"
                className={`form-input ${formErrors.nama ? "input-error" : ""}`}
                {...register("nama", { required: "Ticket name is required" })}
                disabled={overallLoading}
              />
              {formErrors.nama && (
                <p className="error-message">{formErrors.nama.message}</p>
              )}
            </div>

            {/* Lokasi Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="lokasi">
                Location:
              </label>
              <input
                type="text"
                id="lokasi"
                className={`form-input ${
                  formErrors.lokasi ? "input-error" : ""
                }`}
                {...register("lokasi", { required: "Location is required" })}
                disabled={overallLoading}
              />
              {formErrors.lokasi && (
                <p className="error-message">{formErrors.lokasi.message}</p>
              )}
            </div>

            {/* Tanggal Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="tanggal">
                Date & Time:
              </label>
              <input
                type="datetime-local"
                id="tanggal"
                className={`form-input ${
                  formErrors.tanggal ? "input-error" : ""
                }`}
                {...register("tanggal", {
                  required: "Date and time are required",
                })}
                disabled={overallLoading}
              />
              {formErrors.tanggal && (
                <p className="error-message">{formErrors.tanggal.message}</p>
              )}
            </div>

            {/* Harga Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="harga">
                Price:
              </label>
              <input
                type="number"
                id="harga"
                className={`form-input ${
                  formErrors.harga ? "input-error" : ""
                }`}
                min="0"
                step="0.01"
                {...register("harga", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                disabled={overallLoading}
              />
              {formErrors.harga && (
                <p className="error-message">{formErrors.harga.message}</p>
              )}
            </div>

            {/* Stok Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="stok">
                Stock:
              </label>
              <input
                type="number"
                id="stok"
                className={`form-input ${formErrors.stok ? "input-error" : ""}`}
                min="0"
                step="1"
                {...register("stok", {
                  required: "Stock is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
                disabled={overallLoading}
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
                disabled={overallLoading || !token}
              >
                {isMutating
                  ? "Saving..."
                  : isEditing
                  ? "Update Ticket"
                  : "Create Ticket"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={handleCancelEdit}
                  disabled={overallLoading} // Don't disable based on token here
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      {/* --- Ticket List (Only render if token exists and data available) --- */}
      {token && (
        <div className="tiket-list-container">
          <h2>Available Tickets</h2>
          {isLoadingTickets && !tickets.length ? null : tickets.length === 0 && // Already showing loading message above
            !isLoadingTickets ? ( // Handle case after loading completes
            <p>No tickets found.</p>
          ) : (
            <ul className="tiket-list">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className={`tiket-item ${
                    selectedTicketId === ticket.id ? "selected" : ""
                  }`}
                >
                  <div className="tiket-info">
                    <strong>{ticket.nama}</strong> (ID: {ticket.id})<br />
                    Location: {ticket.lokasi}
                    <br />
                    Date:{" "}
                    {ticket.tanggal
                      ? new Date(ticket.tanggal).toLocaleString()
                      : "N/A"}
                    <br />
                    Price: Rp {ticket.harga?.toFixed(2) ?? "0.00"} | Stock:{" "}
                    {ticket.stok ?? 0}
                  </div>
                  <div className="tiket-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleSelectTicket(ticket)}
                      disabled={overallLoading || isEditing}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(ticket.id)}
                      disabled={overallLoading || deleteMutation.isPending} // More specific disable
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === ticket.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default TiketApp;
