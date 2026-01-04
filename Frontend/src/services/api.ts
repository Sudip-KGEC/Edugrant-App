import axios from 'axios';

// Ensure this matches your Render URL in Vercel settings
const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` // Ensures /api is appended to the Render URL
  : "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required if your backend uses cookies or sessions
});

// --- AUTH FUNCTIONS ---

export const sendOtp = async (email: string) => {
  return await api.post('/users/send-otp', { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post('/users/verify-otp', { email, otp });
  return response.data; 
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/users/logout');
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

// --- SCHOLARSHIP FUNCTIONS ---

export const fetchScholarships = async (adminId?: string) => {
  const response = await api.get('/scholarships', {
    params: adminId ? { adminId } : {}
  });
  return response.data;
};

export const createScholarship = async (scholarshipData: any) => {
  const response = await api.post('/scholarships', scholarshipData);
  return {
    ...response.data,
    id: response.data._id
  };
};

// FIXED: Now using the 'api' instance instead of raw fetch
export const applyForScholarship = async (scholarshipId: string, userEmail: string) => {
  const response = await api.post('/scholarships/apply', { scholarshipId, userEmail });
  return response.data;
};

export default api;
