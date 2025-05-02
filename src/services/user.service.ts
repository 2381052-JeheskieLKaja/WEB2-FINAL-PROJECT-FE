import AxiosInstance from "../utils/AxiosInstance";

const API_USER_ENDPOINT = "/users";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to get headers with auth token
const getHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export interface UserProfile {
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await AxiosInstance.get<UserProfile>("/user/profile");
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await AxiosInstance.get<User[]>(API_USER_ENDPOINT, {
      headers: getHeaders()
    });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await AxiosInstance.get<User>(
      `${API_USER_ENDPOINT}/${id}`,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  }
};
