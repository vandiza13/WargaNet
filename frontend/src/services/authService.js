// src/services/authService.js
import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (nama, noRumah, email, password) => {
  const response = await api.post('/auth/register', { 
    nama, 
    noRumah, 
    email, 
    password 
  });
  return response.data;
};