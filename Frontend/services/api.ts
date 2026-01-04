import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, 
});


//Send OTP to Gmail
export const sendOtp = async (email: string) => {
  return await api.post('/users/send-otp', { email });
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  const response = await api.post('/users/verify-otp', { email, otp });
  return response.data; 
};

// Final Registration
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

// SCHOLARSHIP

export const fetchScholarships = async (adminId?: string) => {
  // Use the 'api' instance instead of 'fetch'
  // params will automatically be appended as ?adminId=...
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


export const applyForScholarship = async (scholarshipId: string, userEmail: string) => {
  const response = await fetch('/api/scholarships/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scholarshipId, userEmail }),
  });
  return response.json();
};


export default api;