import { useState, useEffect } from "react";
import { tiketService } from "../services/tiket.service";

interface Ticket {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string;
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
    try {
      const data = await tiketService.getAll();
      setTickets(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch tickets");
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
    try {
      const ticketData = {
        ...formData,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok)
      };

      if (editingId) {
        await tiketService.update(editingId, ticketData);
      } else {
        await tiketService.create(ticketData);
      }
      setFormData({
        nama: "",
        lokasi: "",
        tanggal: "",
        harga: "",
        stok: ""
      });
      setEditingId(null);
      fetchTickets();
    } catch (err) {
      setError("Failed to save ticket");
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setFormData({
      nama: ticket.nama,
      lokasi: ticket.lokasi,
      tanggal: ticket.tanggal,
      harga: ticket.harga.toString(),
      stok: ticket.stok.toString()
    });
    setEditingId(ticket.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await tiketService.delete(id);
        fetchTickets();
      } catch (err) {
        setError("Failed to delete ticket");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ticket Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Ticket" : "Add New Ticket"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              step="1"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingId ? "Update Ticket" : "Add Ticket"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  nama: "",
                  lokasi: "",
                  tanggal: "",
                  harga: "",
                  stok: ""
                });
                setEditingId(null);
              }}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date and Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.lokasi}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(ticket.tanggal).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp {ticket.harga.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.stok}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
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
    </div>
  );
}
