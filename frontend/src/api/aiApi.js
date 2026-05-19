import api from './axios.js';

export const analyzeComplaint = (data) => api.post('ai/analyze', data);
export const chatWithAI = (data) => api.post('ai/chat', data);
