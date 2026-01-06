import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 

});

api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item => ({
        ...item,
        id: item._id || item.id
      }));
    } else if (response.data && typeof response.data === 'object') {
      response.data.id = response.data._id || response.data.id;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// --- AUTH FUNCTIONS ---

export const sendOtp = async (email: string) => {
  return await api.post('/api/users/send-otp', { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post('/api/users/verify-otp', { email, otp });
  return response.data; 
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/api/users/logout');
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

// --- SCHOLARSHIP FUNCTIONS

export const fetchScholarships = async (adminId?: string) => {
  const response = await api.get('/api/scholarships', {
    params: adminId ? { adminId } : {}
  });
  return response.data;
};

export const createScholarship = async (scholarshipData: any) => {
  const response = await api.post('/api/scholarships', scholarshipData);
  return {
    ...response.data,
    id: response.data._id
  };
};

export const applyForScholarship = async (scholarshipId: string, userEmail: string) => {
  const response = await api.post('/api/scholarships/apply', { scholarshipId, userEmail });
  return response.data;
};

export const getStudentApplications = async () => {
  const response = await api.get('/api/scholarships/my-applications');
  return response.data;
};


api.defaults.withCredentials = true;

export default api;
