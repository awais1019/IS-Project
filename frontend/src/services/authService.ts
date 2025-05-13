import axios from 'axios';
import api from '../api/axiosInstance';


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

    // fallback
    return Promise.reject({ msg: 'Signup failed' } as SignupResponse);
  }
};