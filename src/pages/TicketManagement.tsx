import { useState, useEffect } from "react";
// Assuming tiketService is correctly set up elsewhere
// import { tiketService } from "../services/tiket.service";

// Mock service for demonstration if needed
const tiketService = {
  getAll: async (): Promise<Ticket[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Sample data
    return [
      { id: 1, nama: "Concert A", lokasi: "Stadium Alpha", tanggal: "2024-09-15T20:00:00", harga: 500000, stok: 100 },
      { id: 2, nama: "Workshop B", lokasi: "Hall Beta", tanggal: "2024-10-05T09:00:00", harga: 150000, stok: 50 },
    ];
  },
  create: async (data: Omit<Ticket, 'id'>): Promise<Ticket> => {
    console.log("Creating ticket:", data);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...data, id: Math.floor(Math.random() * 1000) };
  },
  update: async (id: number, data: Partial<Ticket>): Promise<Ticket> => {
    console.log("Updating ticket:", id, data);
    await new Promise(resolve => setTimeout(resolve, 300));
    // This would normally fetch the existing and merge
    return { id, nama: "Updated Event", lokasi: "Updated Location", tanggal: new Date().toISOString(), harga: 200000, stok: 99, ...data };
  },
  delete: async (id: number): Promise<void> => {
    console.log("Deleting ticket:", id);
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  },
};
// End Mock Service

interface Ticket {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string; // Keep as string for form compatibility, format on display
  harga: number;
  stok: number;
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    lokasi: "",
    tanggal: "",
    harga: "",
    stok: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true); // Ensure loading state is set at start
    try {
      const data = await tiketService.getAll();
      // Format date string coming from potential DB ISO string for datetime-local input
       const formattedData = data.map(ticket => ({
        ...ticket,
        // Ensure tanggal is in 'YYYY-MM-DDTHH:mm' format if needed for editing consistency
        // This might depend on how tiketService.getAll() returns the date
       }));
      setTickets(formattedData);
      setError("");
    } catch (err) {
      setError("Failed to fetch tickets. Please try again.");
      console.error(err); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // Basic validation (more robust validation recommended)
      if (!formData.nama || !formData.lokasi || !formData.tanggal || !formData.harga || !formData.stok) {
         setError("All fields are required.");
         return;
      }
      const price = parseInt(formData.harga);
      const stock = parseInt(formData.stok);

      if (isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
        setError("Price and Stock must be valid non-negative numbers.");
        return;
      }

      const ticketData = {
        nama: formData.nama,
        lokasi: formData.lokasi,
        tanggal: formData.tanggal, // Keep as string from input
        harga: price,
        stok: stock
      };

      if (editingId) {
        await tiketService.update(editingId, ticketData);
      } else {
        await tiketService.create(ticketData);
      }
      // Reset form and state
      setFormData({
        nama: "",
        lokasi: "",
        tanggal: "",
        harga: "",
        stok: ""
      });
      setEditingId(null);
      fetchTickets(); // Refresh list
    } catch (err) {
      setError("Failed to save ticket. Please try again.");
      console.error(err); // Log error
    }
  };

  const handleEdit = (ticket: Ticket) => {
     // Format date from display/state to 'YYYY-MM-DDTHH:mm' for input value
    const dateForInput = ticket.tanggal ? new Date(ticket.tanggal).toISOString().slice(0, 16) : "";

    setFormData({
      nama: ticket.nama,
      lokasi: ticket.lokasi,
      tanggal: dateForInput,
      harga: ticket.harga.toString(),
      stok: ticket.stok.toString()
    });
    setEditingId(ticket.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      setError(""); // Clear previous errors
      try {
        await tiketService.delete(id);
        fetchTickets(); // Refresh list
      } catch (err) {
        setError("Failed to delete ticket. Please try again.");
        console.error(err); // Log error
      }
    }
  };

  const handleCancelEdit = () => {
     setFormData({
        nama: "",
        lokasi: "",
        tanggal: "",
        harga: "",
        stok: ""
      });
      setEditingId(null);
      setError(""); // Clear error on cancel
  }

  // Format date for display in the table
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('id-ID', { // Indonesian locale example
         dateStyle: 'medium',
         timeStyle: 'short',
       });
    } catch (e) {
        return "Invalid Date";
    }
  }

  // Format currency for display
  const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }


  return (
    // Use a light gray background for the page, and black text as default
    <div className="container mx-auto px-4 py-8 bg-gray-100 text-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Ticket Management</h1>

      {/* Error Message Styling (Monochrome) */}
      {error && (
        <div className="bg-gray-200 border border-gray-400 text-gray-800 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <div className="text-center py-4">Loading tickets...</div>}


      {/* Form Section - White background, subtle border */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-md border border-gray-300"
      >
        <h2 className="text-xl font-semibold mb-4 text-black">
          {editingId ? "Edit Ticket" : "Add New Ticket"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Fields */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              id="nama" // Added id for label association
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              // White background, gray border, black text, focus uses darker gray border/ring
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-white text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="lokasi" // Added id
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-white text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="tanggal" // Added id
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-white text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
              Price (IDR)
            </label>
            <input
              type="number"
              id="harga" // Added id
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-white text-black"
              min="0" // Ensure non-negative price
              required
            />
          </div>
          <div>
            <label htmlFor="stok" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stok" // Added id
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-white text-black"
              min="0" // Ensure non-negative stock
              step="1"
              required
            />
          </div>
        </div>
        {/* Form Actions */}
        <div className="mt-6 flex items-center gap-x-3"> {/* Use flex for better alignment */}
          <button
            type="submit"
            // Black background, white text, slightly lighter black on hover
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-150 ease-in-out"
          >
            {editingId ? "Update Ticket" : "Add Ticket"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit} // Use dedicated cancel handler
              // White background, black text, subtle border, gray bg on hover
              className="bg-white text-black px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-100 transition duration-150 ease-in-out"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Ticket List Table - White background, subtle border */}
      <div className="bg-white rounded-md border border-gray-300 overflow-x-auto"> {/* Added overflow-x-auto for smaller screens */}
        <table className="min-w-full divide-y divide-gray-300">
          {/* Table Header - Light gray background, darker gray text */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date and Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body - White background, gray dividers, dark gray text */}
          <tbody className="bg-white divide-y divide-gray-300">
             {/* Show message if no tickets and not loading */}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No tickets found. Add a new ticket using the form above.
                </td>
              </tr>
            )}
            {/* Map tickets */}
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition duration-150 ease-in-out"> {/* Subtle hover effect */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{ticket.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{ticket.lokasi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatDateForDisplay(ticket.tanggal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatCurrency(ticket.harga)} {/* Format currency */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{ticket.stok}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Action Buttons - Dark gray text, black text on hover */}
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="text-gray-700 hover:text-black mr-3 transition duration-150 ease-in-out"
                    aria-label={`Edit ${ticket.nama}`} // Accessibility
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="text-gray-700 hover:text-black transition duration-150 ease-in-out"
                    aria-label={`Delete ${ticket.nama}`} // Accessibility
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}