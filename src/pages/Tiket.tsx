// src/components/TiketApp.tsx (or wherever you place it)

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
// NOTE: Using date-fns or a more robust date library is generally recommended
// for formatting, but keeping original helpers as requested.
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket
} from "../services/TiketAPI";
import { Tiket, TiketInput } from "../types/Tiket";

// Helper to format ISO date string for datetime-local input
const formatDateForInput = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date for input:", isoDate, e);
    return "";
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

interface TiketFormInputs extends TiketInput {
  tanggal: string;
}

const TiketApp = () => {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<Tiket | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: tickets,
    isLoading,
    error,
    isError // Use boolean flag
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets
  });

  // Mutations remain unchanged logic-wise
  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      reset(); // Reset form on success
      // NOTE: Good practice to also call handleCancelEdit() here if needed
    },
     onError: (error) => { console.error("Create failed:", error); } // Added basic error log
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TiketInput }) =>
      updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      // Reset form and state fully on successful update
      handleCancelEdit();
    },
    onError: (error) => { console.error("Update failed:", error); } // Added basic error log
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error) => { console.error("Delete failed:", error); } // Added basic error log
  });

  // React Hook Form setup remains unchanged logic-wise
  const {
    register,
    handleSubmit,
    reset,
    // NOTE: Consider adding setValue if reset behavior isn't ideal for editing
    formState: { errors, isSubmitting } // Destructure isSubmitting
  } = useForm<TiketFormInputs>();

  // Event handlers remain unchanged logic-wise
  const handleSelectTicket = (ticket: Tiket) => {
    setSelectedTicket(ticket);
    setIsEditing(true);
    // Reset the form with the selected ticket's data
    reset({
      nama: ticket.nama,
      lokasi: ticket.lokasi,
      harga: ticket.harga,
      stok: ticket.stok,
      tanggal: formatDateForInput(ticket.tanggal) // Use helper
    });
  };

  const handleCancelEdit = () => {
    setSelectedTicket(null);
    setIsEditing(false);
    reset(); // Reset form to default empty state
  };

  // Submit handler remains unchanged logic-wise
  const onSubmit: SubmitHandler<TiketFormInputs> = (formData) => {
     // Convert form data (handle date)
    const ticketData: TiketInput = {
      nama: formData.nama,
      lokasi: formData.lokasi,
      harga: Number(formData.harga) || 0, // Ensure number
      stok: Number(formData.stok) || 0,   // Ensure number
      tanggal: formatDateForAPI(formData.tanggal) || "" // Use helper, handle undefined/required
    };
     // Add check for required date if backend needs it
    if (!ticketData.tanggal) {
        console.error("Date is required");
        // Optionally set form error: setError("tanggal", { type: "required", message: "Date is required" });
        return;
     }

    if (isEditing && selectedTicket) {
      updateMutation.mutate({ id: selectedTicket.id, data: ticketData });
    } else {
      createMutation.mutate(ticketData);
    }
  };

  // Delete handler remains unchanged logic-wise
  const handleDelete = (id: number) => {
    // Use window.confirm or a custom modal
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteMutation.mutate(id);
    }
  };

  // Loading state - Apply B&W color
  if (isLoading) {
      return <div className="text-center py-10 text-gray-500">Loading tickets...</div>;
  }

  // Error state - Apply B&W color
  if (isError) { // Use boolean flag
      console.error("Error loading tickets:", error); // Log actual error
      return (
         <div className="text-center py-10 text-red-600" role="alert"> {/* Changed text-red-400 to text-red-600 */}
            Error loading ticket data. Please try again.
         </div>
      );
   }


  // Main component structure - Apply B&W theme
  // Keeping container mx-auto etc. as it was in the original code for this component
  return (
    <div className="container mx-auto px-4 py-8 text-black"> {/* Set default text color */}
      {/* Heading - Apply B&W color */}
      <h1 className="text-3xl font-bold mb-8 text-center text-black"> {/* Changed text-white to text-black */}
        Ticket Management
      </h1>

      {/* Grid layout remains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10"> {/* Increased gap slightly */}

        {/* Form Section - Apply B&W theme */}
        {/* Changed: Background, border, padding */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Changed: Heading color, margin */}
          <h2 className="text-2xl font-semibold mb-6 text-black">
            {isEditing ? "Edit Ticket" : "Create New Ticket"}
          </h2>
          {/* Form structure remains, add noValidate */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Field: Name */}
            <div>
              {/* Changed: Label color */}
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {/* Changed: Input colors and focus style */}
              <input
                id="nama"
                type="text"
                {...register("nama", { required: "Name is required" })}
                className={`w-full px-3 py-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                aria-invalid={errors.nama ? "true" : "false"}
              />
              {/* Changed: Error text color */}
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nama.message}
                </p>
              )}
            </div>

            {/* Field: Location */}
            <div>
               {/* Changed: Label color */}
              <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
               {/* Changed: Input colors and focus style */}
              <input
                 id="lokasi"
                type="text"
                {...register("lokasi", { required: "Location is required" })}
                className={`w-full px-3 py-2 border ${errors.lokasi ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                 aria-invalid={errors.lokasi ? "true" : "false"}
              />
               {/* Changed: Error text color */}
              {errors.lokasi && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lokasi.message}
                </p>
              )}
            </div>

             {/* Field: Price */}
            <div>
               {/* Changed: Label color */}
              <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rp)
              </label>
              {/* Changed: Input colors and focus style */}
              <input
                id="harga"
                type="number"
                {...register("harga", {
                  required: "Price is required",
                  valueAsNumber: true, // Keep this
                  min: { value: 0, message: "Price cannot be negative" } // Keep validation
                })}
                className={`w-full px-3 py-2 border ${errors.harga ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                aria-invalid={errors.harga ? "true" : "false"}
                min="0"
              />
              {/* Changed: Error text color */}
              {errors.harga && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.harga.message}
                </p>
              )}
            </div>

            {/* Field: Stock */}
            <div>
              {/* Changed: Label color */}
              <label htmlFor="stok" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              {/* Changed: Input colors and focus style */}
              <input
                id="stok"
                type="number"
                {...register("stok", {
                  required: "Stock is required",
                  valueAsNumber: true, // Keep this
                  min: { value: 0, message: "Stock cannot be negative" }, // Keep validation
                  validate: value => Number.isInteger(value) || "Stock must be a whole number" // Keep validation
                })}
                className={`w-full px-3 py-2 border ${errors.stok ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                aria-invalid={errors.stok ? "true" : "false"}
                min="0"
                step="1"
              />
               {/* Changed: Error text color */}
              {errors.stok && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stok.message}
                </p>
              )}
            </div>

            {/* Field: Date */}
            <div>
              {/* Changed: Label color */}
              <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                Date and Time
              </label>
              {/* Changed: Input colors and focus style */}
              <input
                id="tanggal"
                type="datetime-local"
                {...register("tanggal", { required: "Date is required" })}
                 className={`w-full px-3 py-2 border ${errors.tanggal ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                 aria-invalid={errors.tanggal ? "true" : "false"}
              />
              {/* Changed: Error text color */}
              {errors.tanggal && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tanggal.message}
                </p>
              )}
            </div>

            {/* Button Container */}
            {/* Changed: Button colors and focus styles */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              {/* Submit Button (Primary - Black) */}
              <button
                type="submit"
                className={`w-full sm:w-auto flex-1 bg-black text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 ${
                  isSubmitting || createMutation.isPending || updateMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
                }`}
                 // Disable based on RHF state OR mutation state
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                 {/* Dynamic text based on state */}
                 {isEditing
                   ? (updateMutation.isPending ? 'Updating...' : 'Update Ticket')
                   : (createMutation.isPending ? 'Creating...' : 'Create Ticket')}
              </button>
               {/* Cancel Button (Secondary - Outline) */}
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto border border-gray-400 text-gray-700 py-2.5 px-4 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                   // Also disable cancel during operations
                  disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section - Apply B&W theme */}
        {/* Changed: Background, border, padding */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
           {/* Changed: Heading color */}
          <h2 className="text-2xl font-semibold mb-6 text-black">Tickets</h2>
          <div className="space-y-4">
             {/* Empty State */}
             {tickets?.length === 0 && !isLoading && (
                 <p className="text-gray-500 text-center py-4">No tickets found.</p>
             )}
             {/* Ticket List Items */}
            {tickets?.map((ticket) => (
              // Changed: List item background, border, hover
              <div
                key={ticket.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-shadow hover:border-gray-300"
              >
                 {/* Layout structure remains */}
                <div className="flex justify-between items-start gap-4">
                  {/* Changed: Text colors */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-black break-words">
                      {ticket.nama}
                    </h3>
                    <p className="text-sm text-gray-600">Location: {ticket.lokasi}</p>
                    {/* NOTE: Using toLocaleString('id-ID') is good for currency */}
                    <p className="text-sm text-gray-600">Price: Rp {ticket.harga.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-gray-600">Stock: {ticket.stok}</p>
                    {/* NOTE: Using toLocaleString() for dates is simple but can vary; date-fns format is more consistent */}
                    <p className="text-sm text-gray-600">
                      Date: {new Date(ticket.tanggal).toLocaleString()}
                    </p>
                  </div>
                   {/* Changed: Button text colors and hover */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-shrink-0 mt-1 sm:mt-0">
                     {/* Edit Button (Link-like) */}
                    <button
                      onClick={() => handleSelectTicket(ticket)}
                      className="text-sm font-medium text-black hover:text-gray-700 transition-colors duration-150"
                       // Disable if currently being deleted
                      disabled={deleteMutation.isPending && deleteMutation.variables === ticket.id}
                    >
                      Edit
                    </button>
                     {/* Delete Button (Red Link-like) */}
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className={`text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-150 ${
                         deleteMutation.isPending && deleteMutation.variables === ticket.id ? "opacity-50 cursor-not-allowed" : "" // Visual feedback for deleting state
                       }`}
                       // Disable button only for the ticket being deleted
                       disabled={deleteMutation.isPending && deleteMutation.variables === ticket.id}
                    >
                       {/* Text changes based on delete state */}
                      {deleteMutation.isPending && deleteMutation.variables === ticket.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiketApp;