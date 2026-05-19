import api from './axios.js';

export const getComplaints = (params) => api.get('/complaints', { params });
export const getComplaintById = (id) => api.get(`/complaints/${id}`);
export const createComplaint = (data) => {
  if (data instanceof FormData) {
    return api.post('/complaints', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.post('/complaints', data);
};
export const updateComplaint = (id, data) => api.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);
export const searchByLocation = (location, params) =>
  api.get('/complaints/search', { params: { location, ...params } });
export const filterByCategory = (category, params) =>
  api.get('/complaints/filter', { params: { category, ...params } });
export const getAnalytics = () => api.get('/complaints/analytics');
export const exportCSV = () =>
  api.get('/complaints/export/csv', { responseType: 'blob' });
