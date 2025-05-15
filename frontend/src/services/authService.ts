import axios from 'axios';
import api, { flaskInstance } from '../api/axiosInstance';
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
  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Unknown error");
    }

    const data = await response.json();
    return data.result;
  } catch (error: unknown) {
    console.error("Error calling /analyze:", error);
    throw new Error("Analysis failed");
  }
};

export const sendOtp = async (email:string) => {
  await api.post(`auth/send-otp`, { email });
};

export const verifyOtp = async (data) => {
  await api.post(`auth/verify-otp`, data);
};




// export const classifyNews = async (newsText) => {
//   try {
//     const response = await axios.post('http://127.0.0.1:5000/classify', {
//       news_text: newsText,
//     });

//     // Handle the response from Flask
//     console.log('Response:', response.data);  // { label: 'REAL', logits: [...] }

//     // You can access the label here
//     const { label } = response.data;
//     alert(`The news is classified as: ${label}`);
//   } catch (error) {
//     console.error('Error during classification:', error);
//     alert('Classification failed.');
//   }
// };