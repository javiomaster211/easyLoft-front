import { api } from './api';
import { LoginResponse } from '../types';

export const authService = {
  register: (email: string, password: string, name: string, phone?: string) => {
    return api.post<LoginResponse>('/auth/register', {
      email,
      password,
      name,
      phone,
    }, false);
  },

  login: (email: string, password: string) => {
    return api.post<LoginResponse>('/auth/login', {
      email,
      password,
    }, false);
  },

  forgotPassword: (email: string) => {
    return api.post<{ message: string }>('/auth/forgot-password', { email }, false);
  },

  resetPassword: (token: string, password: string) => {
    return api.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    }, false);
  },

  getProfile: () => {
    return api.get('/users/me');
  },

  updateProfile: (updates: { name?: string; phone?: string }) => {
    return api.put('/users/me', updates);
  },
};
