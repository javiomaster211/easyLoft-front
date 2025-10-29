import { api } from './api';
import { Loft } from '../types';

export const loftService = {
  create: (name: string, location?: string, description?: string) => {
    return api.post<Loft>('/lofts', {
      name,
      location,
      description,
    });
  },

  getAll: () => {
    return api.get<Loft[]>('/lofts');
  },

  getById: (id: string) => {
    return api.get<Loft>(`/lofts/${id}`);
  },

  update: (id: string, updates: { name?: string; location?: string; description?: string }) => {
    return api.put<Loft>(`/lofts/${id}`, updates);
  },

  delete: (id: string) => {
    return api.delete<{ message: string }>(`/lofts/${id}`);
  },
};
