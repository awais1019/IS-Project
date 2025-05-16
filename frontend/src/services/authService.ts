import axios from 'axios';
import api from '../api/axiosInstance';
import { useAuthStore } from '../stores/useAuthStore';
import type {  ResultProps } from '../components/AdminDashboard';




interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  msg: string;
}

export const signupUser = async (
  name: string,
  email: string,
  password: string
): Promise<SignupResponse> => {
  try {
    const payload: SignupRequest = { name, email, password };
    const response = await api.post<SignupResponse>('/auth/signup', payload);
    return response.data;
  } catch (err: unknown) {

    if (axios.isAxiosError(err)) {
      if (err.response?.data) {
        return Promise.reject(err.response.data as SignupResponse);
      }
    }

    return Promise.reject({ msg: 'Signup failed' } as SignupResponse);
  }
};
export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data;
  useAuthStore.getState().setAuth(token, user);
  return res.data;
};


export const analyzeText = async (text: string): Promise<ResultProps> => {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No token found. Please log in.");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/analyze",
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.result;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error || error.message;
    console.error("Error calling /analyze:", errorMsg);
    throw new Error("Analysis failed: " + errorMsg);
  }
};




export async function toggle2FAFromBackend() {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No token found. Please log in.");

  const response = await axios.post(
    'http://localhost:5000/api/auth/user/toggle2fa',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

