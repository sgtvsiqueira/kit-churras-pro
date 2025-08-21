import { create } from 'zustand';
import { Kit } from '@/domain/types';
import * as api from '@/services/api';

interface KitsState {
  kits: Kit[];
  loadingKits: boolean;
  
  loadKits: () => Promise<void>;
  createKit: (kit: Omit<Kit, 'id'>) => Promise<void>;
  updateKit: (id: string, kit: Partial<Kit>) => Promise<void>;
  deleteKit: (id: string) => Promise<void>;
  getKitById: (id: string) => Kit | undefined;
}

export const useKitsStore = create<KitsState>()((set, get) => ({
  kits: [],
  loadingKits: false,

  loadKits: async () => {
    set({ loadingKits: true });
    try {
      const kits = await api.listKits();
      set({ kits });
    } catch (error) {
      console.error('Erro ao carregar kits:', error);
    } finally {
      set({ loadingKits: false });
    }
  },

  createKit: async (kitData) => {
    const novoKit = await api.createKit(kitData);
    set((state) => ({ kits: [...state.kits, novoKit] }));
  },

  updateKit: async (id, kitData) => {
    const kitAtualizado = await api.updateKit(id, kitData);
    set((state) => ({
      kits: state.kits.map((k) => (k.id === id ? kitAtualizado : k))
    }));
  },

  deleteKit: async (id) => {
    await api.deleteKit(id);
    set((state) => ({
      kits: state.kits.filter((k) => k.id !== id)
    }));
  },

  getKitById: (id) => get().kits.find(kit => kit.id === id)
}));