import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 

});


adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
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

export const getAdminScholarships = async (adminId: string) => {
  const response = await adminApi.get(`/api/scholarships`, {
    params: { adminId }
  });
  return response.data;
};

export const getAdminApplications = async () => {
  const response = await adminApi.get('/api/scholarships/admin/applications');
  return response.data;
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const response = await adminApi.patch('/api/scholarships/admin/update-status', { 
    applicationId, 
    status 
  });
  return response.data;
};


adminApi.defaults.withCredentials = true;

export default adminApi;