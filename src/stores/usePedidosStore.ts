import { create } from 'zustand';
import { Pedido, Cliente, PedidoStatus, DashboardMetrics } from '@/domain/types';
import * as api from '@/services/api';

interface PedidosState {
  // Pedidos
  pedidos: Pedido[];
  loadingPedidos: boolean;
  
  // Clientes
  clientes: Cliente[];
  loadingClientes: boolean;
  
  // Dashboard
  dashboardMetrics: DashboardMetrics | null;
  loadingDashboard: boolean;
  
  // Actions - Pedidos
  loadPedidos: () => Promise<void>;
  createPedido: (pedido: Omit<Pedido, 'id' | 'codigo' | 'criacaoEm' | 'atualizacaoEm'>) => Promise<void>;
  updatePedido: (id: string, pedido: Partial<Pedido>) => Promise<void>;
  updatePedidoStatus: (id: string, status: PedidoStatus) => Promise<void>;
  cancelarPedido: (id: string, motivo?: string) => Promise<void>;
  
  // Actions - Clientes
  loadClientes: () => Promise<void>;
  createCliente: (cliente: Omit<Cliente, 'id'>) => Promise<Cliente>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  
  // Actions - Dashboard
  loadDashboard: () => Promise<void>;
  
  // Helpers
  getPedidoById: (id: string) => Pedido | undefined;
  getClienteById: (id: string) => Cliente | undefined;
  getPedidosPorStatus: (status: PedidoStatus) => Pedido[];
  getFaturamentoPeriodo: (inicio: string, fim: string) => number;
}

export const usePedidosStore = create<PedidosState>()((set, get) => ({
  // State
  pedidos: [],
  loadingPedidos: false,
  clientes: [],
  loadingClientes: false,
  dashboardMetrics: null,
  loadingDashboard: false,

  // Actions - Pedidos
  loadPedidos: async () => {
    set({ loadingPedidos: true });
    try {
      const pedidos = await api.listPedidos();
      set({ pedidos });
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      set({ loadingPedidos: false });
    }
  },

  createPedido: async (pedidoData) => {
    const novoPedido = await api.createPedido(pedidoData);
    set((state) => ({ pedidos: [novoPedido, ...state.pedidos] }));
  },

  updatePedido: async (id, pedidoData) => {
    const pedidoAtualizado = await api.updatePedido(id, pedidoData);
    set((state) => ({
      pedidos: state.pedidos.map((p) => (p.id === id ? pedidoAtualizado : p))
    }));
  },

  updatePedidoStatus: async (id, status) => {
    const pedidoAtualizado = await api.updatePedidoStatus(id, status);
    set((state) => ({
      pedidos: state.pedidos.map((p) => (p.id === id ? pedidoAtualizado : p))
    }));
  },

  cancelarPedido: async (id, motivo) => {
    await api.cancelarPedido(id, motivo);
    set((state) => ({
      pedidos: state.pedidos.map((p) => 
        p.id === id 
          ? { ...p, status: 'CANCELADO' as PedidoStatus, atualizacaoEm: new Date().toISOString() }
          : p
      )
    }));
  },

  // Actions - Clientes
  loadClientes: async () => {
    set({ loadingClientes: true });
    try {
      const clientes = await api.listClientes();
      set({ clientes });
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      set({ loadingClientes: false });
    }
  },

  createCliente: async (cliente) => {
    const novoCliente = await api.createCliente(cliente);
    set((state) => ({ clientes: [...state.clientes, novoCliente] }));
    return novoCliente;
  },

  updateCliente: async (id, cliente) => {
    const clienteAtualizado = await api.updateCliente(id, cliente);
    set((state) => ({
      clientes: state.clientes.map((c) => (c.id === id ? clienteAtualizado : c))
    }));
  },

  deleteCliente: async (id) => {
    await api.deleteCliente(id);
    set((state) => ({
      clientes: state.clientes.filter((c) => c.id !== id)
    }));
  },

  // Actions - Dashboard
  loadDashboard: async () => {
    set({ loadingDashboard: true });
    try {
      const dashboardMetrics = await api.getDashboardMetrics();
      set({ dashboardMetrics });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      set({ loadingDashboard: false });
    }
  },

  // Helpers
  getPedidoById: (id) => get().pedidos.find(pedido => pedido.id === id),
  
  getClienteById: (id) => get().clientes.find(cliente => cliente.id === id),
  
  getPedidosPorStatus: (status) => get().pedidos.filter(pedido => pedido.status === status),
  
  getFaturamentoPeriodo: (inicio, fim) => {
    const pedidos = get().pedidos.filter(pedido => 
      pedido.status === 'CONCLUIDO' &&
      pedido.criacaoEm >= inicio &&
      pedido.criacaoEm <= fim
    );
    
    return pedidos.reduce((total, pedido) => total + pedido.pagamento.valorTotal, 0);
  }
}));