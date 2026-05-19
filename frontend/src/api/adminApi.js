import api from './axios.js';

export const getUsers = (params) => api.get('/admin/users', { params });
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
