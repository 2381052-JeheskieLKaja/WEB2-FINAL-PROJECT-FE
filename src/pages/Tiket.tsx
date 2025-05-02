// src/components/TiketApp.tsx (or wherever you place it)

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";

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
    error
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets
  });

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TiketInput }) =>
      updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      reset();
      setSelectedTicket(null);
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TiketFormInputs>();

  const handleSelectTicket = (ticket: Tiket) => {
    setSelectedTicket(ticket);
    setIsEditing(true);
    reset({
      nama: ticket.nama,
      lokasi: ticket.lokasi,
      harga: ticket.harga,
      stok: ticket.stok,
      tanggal: formatDateForInput(ticket.tanggal)
    });
  };

  const handleCancelEdit = () => {
    setSelectedTicket(null);
    setIsEditing(false);
    reset();
  };

  const onSubmit: SubmitHandler<TiketFormInputs> = (formData) => {
    const ticketData: TiketInput = {
      nama: formData.nama,
      lokasi: formData.lokasi,
      harga: formData.harga,
      stok: formData.stok,
      tanggal: formatDateForAPI(formData.tanggal) || ""
    };

    if (isEditing && selectedTicket) {
      updateMutation.mutate({ id: selectedTicket.id, data: ticketData });
    } else {
      createMutation.mutate(ticketData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">Error loading tickets</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Ticket Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Edit Ticket" : "Create New Ticket"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                {...register("nama", { required: "Name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nama.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                {...register("lokasi", { required: "Location is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.lokasi && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lokasi.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                {...register("harga", {
                  required: "Price is required",
                  min: 0
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.harga && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.harga.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register("stok", {
                  required: "Stock is required",
                  min: 0,
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="1"
              />
              {errors.stok && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stok.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="datetime-local"
                {...register("tanggal", { required: "Date is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.tanggal && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tanggal.message}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isEditing ? "Update Ticket" : "Create Ticket"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tickets List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Tickets List</h2>
          <div className="space-y-4">
            {tickets?.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{ticket.nama}</h3>
                    <p className="text-gray-600">{ticket.lokasi}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Price:</span> Rp
                        {ticket.harga}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(ticket.tanggal).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectTicket(ticket)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
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
