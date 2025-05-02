import AxiosInstance from "../utils/AxiosInstance";

export interface Tiket {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string;
  harga: number;
  stok: number;
}

export interface CreateTiketData {
  nama: string;
  lokasi: string;
  tanggal: string;
  harga: number;
  stok: number;
}

export interface UpdateTiketData {
  nama?: string;
  lokasi?: string;
  tanggal?: string;
  harga?: number;
  stok?: number;
}

export const tiketService = {
  getAll: async (): Promise<Tiket[]> => {
    const response = await AxiosInstance.get<Tiket[]>("/tiket");
    return response.data;
  },

  getById: async (id: number): Promise<Tiket> => {
    const response = await AxiosInstance.get<Tiket>(`/tiket/${id}`);
    return response.data;
  },

  create: async (data: CreateTiketData): Promise<Tiket> => {
    const response = await AxiosInstance.post<Tiket>("/tiket", data);
    return response.data;
  },

  update: async (id: number, data: UpdateTiketData): Promise<Tiket> => {
    const response = await AxiosInstance.put<Tiket>(`/tiket/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await AxiosInstance.delete(`/tiket/${id}`);
  }
};
