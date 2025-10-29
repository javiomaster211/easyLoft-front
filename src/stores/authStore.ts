import { create } from 'zustand';
import { api, saveToken, removeToken } from '../services/api';
import { User, LoginResponse } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (email: string, password: string, name: string, phone?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<LoginResponse>('/auth/register', {
        email,
        password,
        name,
        phone,
      }, false);
      
      saveToken(response.access_token);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al registrarse', isLoading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      }, false);
      
      saveToken(response.access_token);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Credenciales incorrectas', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await api.get<User>('/users/me');
      set({ user, isAuthenticated: true });
    } catch (error) {
      removeToken();
      set({ isAuthenticated: false, user: null });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/forgot-password', { email }, false);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al enviar email', isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/reset-password', { token, password }, false);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al restablecer contraseña', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
