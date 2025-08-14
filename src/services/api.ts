/**
 * Serviço de API Mock para Kit Churras Pro
 * 
 * Este arquivo simula uma API REST completa usando localStorage para persistência.
 * Para integração com backend real (ex: n8n webhooks), substitua as implementações
 * por chamadas HTTP reais mantendo as mesmas assinaturas de função.
 * 
 * Exemplo de migração para API real:
 * 
 * async function listPedidos(): Promise<Pedido[]> {
 *   const response = await fetch(`${API_BASE_URL}/pedidos`, {
 *     headers: { 'Content-Type': 'application/json' }
 *   });
 *   return response.json();
 * }
 * 
 * async function createPedido(pedido: Omit<Pedido, 'id' | 'codigo' | 'criacaoEm' | 'atualizacaoEm'>): Promise<Pedido> {
 *   const response = await fetch(`${API_BASE_URL}/pedidos`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(pedido)
 *   });
 *   return response.json();
 * }
 */

import { 
  ItemEstoque, 
  MovimentoEstoque, 
  Kit, 
  Pedido, 
  Cliente, 
  PedidoStatus,
  DashboardMetrics,
  UnidadeMedida 
} from '@/domain/types';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper para simular delay de rede
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para gerar IDs únicos
const generateId = () => crypto.randomUUID();

// Helper para gerar códigos sequenciais
const generateCode = (prefix: string) => {
  const year = new Date().getFullYear();
  const count = Math.floor(Math.random() * 9999) + 1;
  return `#${prefix}-${year}-${count.toString().padStart(4, '0')}`;
};

// Mock data inicial
const initializeMockData = () => {
  if (!localStorage.getItem('kit-churras-itens')) {
    const itensMock: ItemEstoque[] = [
      {
        id: generateId(),
        nome: 'Picanha Premium 1kg',
        sku: 'CAR-PIC-001',
        unidade: 'kg',
        custoUnitario: 45.00,
        estoqueAtual: 12,
        estoqueMinimo: 5,
        categoria: 'Carnes',
        ativo: true
      },
      {
        id: generateId(),
        nome: 'Linguiça Toscana 500g',
        sku: 'CAR-LIN-001',
        unidade: 'kg',
        custoUnitario: 18.00,
        estoqueAtual: 8,
        estoqueMinimo: 10,
        categoria: 'Carnes',
        ativo: true
      },
      {
        id: generateId(),
        nome: 'Carvão Vegetal 3kg',
        sku: 'CAR-CAR-001',
        unidade: 'pct',
        custoUnitario: 12.50,
        estoqueAtual: 15,
        estoqueMinimo: 8,
        categoria: 'Carvão',
        ativo: true
      },
      {
        id: generateId(),
        nome: 'Refrigerante Lata 350ml',
        sku: 'BEB-REF-001',
        unidade: 'un',
        custoUnitario: 2.50,
        estoqueAtual: 24,
        estoqueMinimo: 20,
        categoria: 'Bebidas',
        ativo: true
      }
    ];
    localStorage.setItem('kit-churras-itens', JSON.stringify(itensMock));

    const kitsMock: Kit[] = [
      {
        id: generateId(),
        nome: 'Kit Churrasco Família',
        codigo: 'KIT-FAM-001',
        preco: 120.00,
        descricao: 'Kit completo para família de 4 pessoas',
        itens: [
          { itemId: itensMock[0].id, quantidade: 1 },
          { itemId: itensMock[1].id, quantidade: 0.5 },
          { itemId: itensMock[2].id, quantidade: 1 },
          { itemId: itensMock[3].id, quantidade: 4 }
        ],
        ativo: true
      }
    ];
    localStorage.setItem('kit-churras-kits', JSON.stringify(kitsMock));

    const clientesMock: Cliente[] = [
      {
        id: generateId(),
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        email: 'joao@email.com',
        endereco: 'Rua das Flores, 123 - São Paulo/SP'
      }
    ];
    localStorage.setItem('kit-churras-clientes', JSON.stringify(clientesMock));
  }
};

// Initialize mock data
initializeMockData();

// ===== ITENS ESTOQUE =====

export async function listItensEstoque(): Promise<ItemEstoque[]> {
  await sleep(300);
  const data = localStorage.getItem('kit-churras-itens');
  return data ? JSON.parse(data) : [];
}

export async function createItemEstoque(item: Omit<ItemEstoque, 'id'>): Promise<ItemEstoque> {
  await sleep(500);
  const novoItem: ItemEstoque = { ...item, id: generateId() };
  const itens = await listItensEstoque();
  const novosItens = [...itens, novoItem];
  localStorage.setItem('kit-churras-itens', JSON.stringify(novosItens));
  return novoItem;
}

export async function updateItemEstoque(id: string, item: Partial<ItemEstoque>): Promise<ItemEstoque> {
  await sleep(500);
  const itens = await listItensEstoque();
  const index = itens.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Item não encontrado');
  
  const itemAtualizado = { ...itens[index], ...item };
  itens[index] = itemAtualizado;
  localStorage.setItem('kit-churras-itens', JSON.stringify(itens));
  return itemAtualizado;
}

export async function deleteItemEstoque(id: string): Promise<void> {
  await sleep(500);
  const itens = await listItensEstoque();
  const novosItens = itens.filter(i => i.id !== id);
  localStorage.setItem('kit-churras-itens', JSON.stringify(novosItens));
}

// ===== MOVIMENTOS ESTOQUE =====

export async function listMovimentosEstoque(): Promise<MovimentoEstoque[]> {
  await sleep(300);
  const data = localStorage.getItem('kit-churras-movimentos');
  return data ? JSON.parse(data) : [];
}

export async function createMovimentoEstoque(movimento: Omit<MovimentoEstoque, 'id'>): Promise<MovimentoEstoque> {
  await sleep(500);
  const novoMovimento: MovimentoEstoque = { ...movimento, id: generateId() };
  const movimentos = await listMovimentosEstoque();
  const novosMovimentos = [novoMovimento, ...movimentos];
  localStorage.setItem('kit-churras-movimentos', JSON.stringify(novosMovimentos));
  return novoMovimento;
}

// ===== KITS =====

export async function listKits(): Promise<Kit[]> {
  await sleep(300);
  const data = localStorage.getItem('kit-churras-kits');
  return data ? JSON.parse(data) : [];
}

export async function createKit(kit: Omit<Kit, 'id'>): Promise<Kit> {
  await sleep(500);
  const novoKit: Kit = { ...kit, id: generateId() };
  const kits = await listKits();
  const novosKits = [...kits, novoKit];
  localStorage.setItem('kit-churras-kits', JSON.stringify(novosKits));
  return novoKit;
}

export async function updateKit(id: string, kit: Partial<Kit>): Promise<Kit> {
  await sleep(500);
  const kits = await listKits();
  const index = kits.findIndex(k => k.id === id);
  if (index === -1) throw new Error('Kit não encontrado');
  
  const kitAtualizado = { ...kits[index], ...kit };
  kits[index] = kitAtualizado;
  localStorage.setItem('kit-churras-kits', JSON.stringify(kits));
  return kitAtualizado;
}

export async function deleteKit(id: string): Promise<void> {
  await sleep(500);
  const kits = await listKits();
  const novosKits = kits.filter(k => k.id !== id);
  localStorage.setItem('kit-churras-kits', JSON.stringify(novosKits));
}

// ===== CLIENTES =====

export async function listClientes(): Promise<Cliente[]> {
  await sleep(300);
  const data = localStorage.getItem('kit-churras-clientes');
  return data ? JSON.parse(data) : [];
}

export async function createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  await sleep(500);
  const novoCliente: Cliente = { ...cliente, id: generateId() };
  const clientes = await listClientes();
  const novosClientes = [...clientes, novoCliente];
  localStorage.setItem('kit-churras-clientes', JSON.stringify(novosClientes));
  return novoCliente;
}

export async function updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
  await sleep(500);
  const clientes = await listClientes();
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cliente não encontrado');
  
  const clienteAtualizado = { ...clientes[index], ...cliente };
  clientes[index] = clienteAtualizado;
  localStorage.setItem('kit-churras-clientes', JSON.stringify(clientes));
  return clienteAtualizado;
}

export async function deleteCliente(id: string): Promise<void> {
  await sleep(500);
  const clientes = await listClientes();
  const novosClientes = clientes.filter(c => c.id !== id);
  localStorage.setItem('kit-churras-clientes', JSON.stringify(novosClientes));
}

// ===== PEDIDOS =====

export async function listPedidos(): Promise<Pedido[]> {
  await sleep(300);
  const data = localStorage.getItem('kit-churras-pedidos');
  return data ? JSON.parse(data) : [];
}

export async function createPedido(pedidoData: Omit<Pedido, 'id' | 'codigo' | 'criacaoEm' | 'atualizacaoEm'>): Promise<Pedido> {
  await sleep(500);
  const agora = new Date().toISOString();
  const novoPedido: Pedido = {
    ...pedidoData,
    id: generateId(),
    codigo: generateCode('PED'),
    criacaoEm: agora,
    atualizacaoEm: agora
  };
  
  const pedidos = await listPedidos();
  const novosPedidos = [novoPedido, ...pedidos];
  localStorage.setItem('kit-churras-pedidos', JSON.stringify(novosPedidos));
  return novoPedido;
}

export async function updatePedido(id: string, pedidoData: Partial<Pedido>): Promise<Pedido> {
  await sleep(500);
  const pedidos = await listPedidos();
  const index = pedidos.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Pedido não encontrado');
  
  const pedidoAtualizado = { 
    ...pedidos[index], 
    ...pedidoData, 
    atualizacaoEm: new Date().toISOString() 
  };
  
  pedidos[index] = pedidoAtualizado;
  localStorage.setItem('kit-churras-pedidos', JSON.stringify(pedidos));
  return pedidoAtualizado;
}

export async function updatePedidoStatus(id: string, status: PedidoStatus): Promise<Pedido> {
  // Lógica para baixa de estoque quando status muda para EM_PREPARO
  if (status === 'EM_PREPARO') {
    const pedidos = await listPedidos();
    const pedido = pedidos.find(p => p.id === id);
    
    if (pedido && pedido.status === 'PENDENTE') {
      // Criar movimentos de baixa para cada item do kit
      const kits = await listKits();
      
      for (const itemPedido of pedido.itens) {
        const kit = kits.find(k => k.id === itemPedido.kitId);
        if (kit) {
          for (const composicao of kit.itens) {
            const quantidadeBaixa = composicao.quantidade * itemPedido.quantidade;
            await createMovimentoEstoque({
              tipo: 'SAIDA',
              itemId: composicao.itemId,
              quantidade: quantidadeBaixa,
              motivo: 'Baixa por pedido',
              referencia: pedido.codigo,
              data: new Date().toISOString(),
              usuario: 'Sistema'
            });
          }
        }
      }
    }
  }
  
  return updatePedido(id, { status });
}

export async function cancelarPedido(id: string, motivo?: string): Promise<void> {
  const pedidos = await listPedidos();
  const pedido = pedidos.find(p => p.id === id);
  
  if (pedido && pedido.status === 'EM_PREPARO') {
    // Estornar movimentos se o pedido estava em preparo
    const kits = await listKits();
    
    for (const itemPedido of pedido.itens) {
      const kit = kits.find(k => k.id === itemPedido.kitId);
      if (kit) {
        for (const composicao of kit.itens) {
          const quantidadeEstorno = composicao.quantidade * itemPedido.quantidade;
          await createMovimentoEstoque({
            tipo: 'ENTRADA',
            itemId: composicao.itemId,
            quantidade: quantidadeEstorno,
            motivo: `Estorno por cancelamento - ${motivo || 'Sem motivo'}`,
            referencia: pedido.codigo,
            data: new Date().toISOString(),
            usuario: 'Sistema'
          });
        }
      }
    }
  }
  
  await updatePedido(id, { status: 'CANCELADO' });
}

// ===== DASHBOARD =====

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await sleep(400);
  
  const pedidos = await listPedidos();
  const itens = await listItensEstoque();
  
  const hoje = new Date().toISOString().split('T')[0];
  const pedidosHoje = pedidos.filter(p => p.criacaoEm.startsWith(hoje));
  
  const pedidosHojeMetrics = {
    total: pedidosHoje.length,
    pendentes: pedidosHoje.filter(p => p.status === 'PENDENTE').length,
    emPreparo: pedidosHoje.filter(p => p.status === 'EM_PREPARO').length,
    concluidos: pedidosHoje.filter(p => p.status === 'CONCLUIDO').length,
    faturamento: pedidosHoje
      .filter(p => p.status === 'CONCLUIDO')
      .reduce((total, p) => total + p.pagamento.valorTotal, 0)
  };
  
  const estoque = {
    itensEstoqueBaixo: itens.filter(i => i.estoqueAtual <= i.estoqueMinimo && i.ativo).length,
    totalItens: itens.filter(i => i.ativo).length
  };
  
  // Gerar dados mock para o gráfico dos últimos 7 dias
  const graficoPedidos = [];
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const dataStr = data.toISOString().split('T')[0];
    
    const pedidosDia = pedidos.filter(p => p.criacaoEm.startsWith(dataStr));
    graficoPedidos.push({
      data: dataStr,
      pedidos: pedidosDia.length,
      faturamento: pedidosDia
        .filter(p => p.status === 'CONCLUIDO')
        .reduce((total, p) => total + p.pagamento.valorTotal, 0)
    });
  }
  
  return {
    pedidosHoje: pedidosHojeMetrics,
    estoque,
    graficoPedidos
  };
}