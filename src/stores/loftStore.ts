import { create } from 'zustand';
import { loftService } from '../services/loftService';
import { Loft } from '../types';

interface LoftState {
  lofts: Loft[];
  currentLoft: Loft | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchLofts: () => Promise<void>;
  fetchLoft: (id: string) => Promise<void>;
  createLoft: (name: string, location?: string, description?: string) => Promise<void>;
  updateLoft: (id: string, updates: Partial<Loft>) => Promise<void>;
  deleteLoft: (id: string) => Promise<void>;
  setCurrentLoft: (loft: Loft | null) => void;
  clearError: () => void;
}

export const useLoftStore = create<LoftState>((set, get) => ({
  lofts: [],
  currentLoft: null,
  isLoading: false,
  error: null,

  fetchLofts: async () => {
    set({ isLoading: true, error: null });
    try {
      const lofts = await loftService.getAll();
      set({ lofts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar palomares', isLoading: false });
    }
  },

  fetchLoft: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const loft = await loftService.getById(id);
      set({ currentLoft: loft, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar palomar', isLoading: false });
    }
  },

  createLoft: async (name: string, location?: string, description?: string) => {
    set({ isLoading: true, error: null });
    try {
      const newLoft = await loftService.create(name, location, description);
      const lofts = [...get().lofts, newLoft];
      set({ lofts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al crear palomar', isLoading: false });
      throw error;
    }
  },

  updateLoft: async (id: string, updates: Partial<Loft>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLoft = await loftService.update(id, updates);
      const lofts = get().lofts.map(l => l._id === id ? updatedLoft : l);
      set({ 
        lofts, 
        currentLoft: get().currentLoft?._id === id ? updatedLoft : get().currentLoft,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar palomar', isLoading: false });
      throw error;
    }
  },

  deleteLoft: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await loftService.delete(id);
      const lofts = get().lofts.filter(l => l._id !== id);
      set({ 
        lofts, 
        currentLoft: get().currentLoft?._id === id ? null : get().currentLoft,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Error al eliminar palomar', isLoading: false });
      throw error;
    }
  },

  setCurrentLoft: (loft: Loft | null) => {
    set({ currentLoft: loft });
  },

  clearError: () => set({ error: null }),
}));
