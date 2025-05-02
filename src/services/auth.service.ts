import AxiosInstance from "../utils/AxiosInstance";

const API_AUTH_ENDPOINT = "/auth";

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  nama : string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  access_token: string;
  user: {
    id: number;
    nama: string;
    email: string;
  };
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post<AuthResponse>(
      `${API_AUTH_ENDPOINT}/login`,
      credentials
    );
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post<AuthResponse>(
      `${API_AUTH_ENDPOINT}/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AxiosInstance.post(
      `${API_AUTH_ENDPOINT}/logout`,
      {},
      {
        headers: getHeaders()
      }
    );
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.get<AuthResponse>(
      `${API_AUTH_ENDPOINT}/me`,
      {
        headers: getHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};
