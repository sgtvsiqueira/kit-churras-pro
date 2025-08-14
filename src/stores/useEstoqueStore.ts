import { create } from 'zustand';
import { ItemEstoque, MovimentoEstoque, Kit } from '@/domain/types';
import * as api from '@/services/api';

interface EstoqueState {
  // Items
  itens: ItemEstoque[];
  loadingItens: boolean;
  
  // Movements
  movimentos: MovimentoEstoque[];
  loadingMovimentos: boolean;
  
  // Kits
  kits: Kit[];
  loadingKits: boolean;
  
  // Actions - Items
  loadItens: () => Promise<void>;
  createItem: (item: Omit<ItemEstoque, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Partial<ItemEstoque>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Actions - Movements
  loadMovimentos: () => Promise<void>;
  createMovimento: (movimento: Omit<MovimentoEstoque, 'id'>) => Promise<void>;
  ajustarEstoque: (itemId: string, quantidade: number, motivo: string) => Promise<void>;
  
  // Actions - Kits
  loadKits: () => Promise<void>;
  createKit: (kit: Omit<Kit, 'id'>) => Promise<void>;
  updateKit: (id: string, kit: Partial<Kit>) => Promise<void>;
  deleteKit: (id: string) => Promise<void>;
  
  // Helpers
  getItemById: (id: string) => ItemEstoque | undefined;
  getKitById: (id: string) => Kit | undefined;
  getItensEstoqueBaixo: () => ItemEstoque[];
  calcularCustoKit: (kitId: string) => number;
  calcularMargemKit: (kitId: string) => number;
  verificarDisponibilidadeKit: (kitId: string, quantidade: number) => { disponivel: boolean; itensInsuficientes: string[] };
}

export const useEstoqueStore = create<EstoqueState>()((set, get) => ({
  // State
  itens: [],
  loadingItens: false,
  movimentos: [],
  loadingMovimentos: false,
  kits: [],
  loadingKits: false,

  // Actions - Items
  loadItens: async () => {
    set({ loadingItens: true });
    try {
      const itens = await api.listItensEstoque();
      set({ itens });
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      set({ loadingItens: false });
    }
  },

  createItem: async (item) => {
    const novoItem = await api.createItemEstoque(item);
    set((state) => ({ itens: [...state.itens, novoItem] }));
  },

  updateItem: async (id, item) => {
    const itemAtualizado = await api.updateItemEstoque(id, item);
    set((state) => ({
      itens: state.itens.map((i) => (i.id === id ? itemAtualizado : i))
    }));
  },

  deleteItem: async (id) => {
    await api.deleteItemEstoque(id);
    set((state) => ({
      itens: state.itens.filter((i) => i.id !== id)
    }));
  },

  // Actions - Movements
  loadMovimentos: async () => {
    set({ loadingMovimentos: true });
    try {
      const movimentos = await api.listMovimentosEstoque();
      set({ movimentos });
    } catch (error) {
      console.error('Erro ao carregar movimentos:', error);
    } finally {
      set({ loadingMovimentos: false });
    }
  },

  createMovimento: async (movimento) => {
    const novoMovimento = await api.createMovimentoEstoque(movimento);
    set((state) => ({ movimentos: [novoMovimento, ...state.movimentos] }));
    
    // Update item stock
    const item = get().itens.find(i => i.id === movimento.itemId);
    if (item) {
      const novaQuantidade = movimento.tipo === 'ENTRADA' || movimento.tipo === 'AJUSTE' 
        ? item.estoqueAtual + movimento.quantidade 
        : item.estoqueAtual - movimento.quantidade;
      
      set((state) => ({
        itens: state.itens.map((i) => 
          i.id === movimento.itemId 
            ? { ...i, estoqueAtual: Math.max(0, novaQuantidade) }
            : i
        )
      }));
    }
  },

  ajustarEstoque: async (itemId, quantidade, motivo) => {
    const item = get().itens.find(i => i.id === itemId);
    if (!item) return;

    const diferenca = quantidade - item.estoqueAtual;
    const tipo = diferenca >= 0 ? 'ENTRADA' : 'SAIDA';
    
    await get().createMovimento({
      tipo: 'AJUSTE',
      itemId,
      quantidade: Math.abs(diferenca),
      motivo,
      data: new Date().toISOString(),
      usuario: 'Sistema'
    });
  },

  // Actions - Kits
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

  createKit: async (kit) => {
    const novoKit = await api.createKit(kit);
    set((state) => ({ kits: [...state.kits, novoKit] }));
  },

  updateKit: async (id, kit) => {
    const kitAtualizado = await api.updateKit(id, kit);
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

  // Helpers
  getItemById: (id) => get().itens.find(item => item.id === id),
  
  getKitById: (id) => get().kits.find(kit => kit.id === id),
  
  getItensEstoqueBaixo: () => 
    get().itens.filter(item => item.estoqueAtual <= item.estoqueMinimo && item.ativo),

  calcularCustoKit: (kitId) => {
    const kit = get().getKitById(kitId);
    const itens = get().itens;
    
    if (!kit) return 0;
    
    return kit.itens.reduce((total, composicao) => {
      const item = itens.find(i => i.id === composicao.itemId);
      return total + (item ? item.custoUnitario * composicao.quantidade : 0);
    }, 0);
  },

  calcularMargemKit: (kitId) => {
    const kit = get().getKitById(kitId);
    if (!kit || kit.preco === 0) return 0;
    
    const custo = get().calcularCustoKit(kitId);
    return ((kit.preco - custo) / kit.preco) * 100;
  },

  verificarDisponibilidadeKit: (kitId, quantidade) => {
    const kit = get().getKitById(kitId);
    const itens = get().itens;
    
    if (!kit) return { disponivel: false, itensInsuficientes: [] };
    
    const itensInsuficientes: string[] = [];
    
    kit.itens.forEach(composicao => {
      const item = itens.find(i => i.id === composicao.itemId);
      if (item) {
        const quantidadeNecessaria = composicao.quantidade * quantidade;
        if (item.estoqueAtual < quantidadeNecessaria) {
          itensInsuficientes.push(`${item.nome} (necessário: ${quantidadeNecessaria}, disponível: ${item.estoqueAtual})`);
        }
      }
    });
    
    return {
      disponivel: itensInsuficientes.length === 0,
      itensInsuficientes
    };
  }
}));