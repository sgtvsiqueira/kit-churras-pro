export type UnidadeMedida = 'un' | 'kg' | 'g' | 'ml' | 'l' | 'pct';

export type ItemEstoque = {
  id: string;
  nome: string;           // Ex.: Picanha 1kg, Carvão 3kg
  sku: string;
  unidade: UnidadeMedida;
  custoUnitario: number;  // custo médio
  estoqueAtual: number;   // em unidade definida
  estoqueMinimo: number;
  categoria?: string;     // Carnes, Carvão, Bebidas, etc.
  ativo: boolean;
};

export type Kit = {
  id: string;
  nome: string;           // Ex.: Kit Churrasco Família
  codigo: string;
  preco: number;          // preço de venda
  descricao?: string;
  itens: Array<{ itemId: string; quantidade: number }>; // composição do kit
  ativo: boolean;
  imagemUrl?: string;
};

export type MovimentoEstoque = {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  itemId: string;
  quantidade: number;
  motivo?: string;        // compra, quebra, ajuste inventário, baixa por pedido
  referencia?: string;    // id do pedido, nota de compra, etc.
  data: string;           // ISO
  usuario?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  obs?: string;
};

export type PedidoStatus = 'PENDENTE' | 'EM_PREPARO' | 'SAIU_PARA_ENTREGA' | 'CONCLUIDO' | 'CANCELADO';

export type PedidoItem = {
  kitId: string;
  quantidade: number;
  precoUnitario: number; // snapshot do preço do kit no momento
  subtotal: number;
};

export type Pedido = {
  id: string;
  codigo: string; // ex: #PED-2025-0001
  cliente: Cliente;
  itens: PedidoItem[];
  status: PedidoStatus;
  pagamento: {
    forma: 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO';
    valorTotal: number;
    pago: boolean;
  };
  entrega: {
    tipo: 'RETIRADA' | 'DELIVERY';
    taxa?: number;
    janela?: string; // ex: "Hoje 18:00–19:00"
    endereco?: string;
  };
  criacaoEm: string;
  atualizacaoEm: string;
  obs?: string;
};

// Tipos auxiliares para filtros e buscas
export type FiltrosPedidos = {
  status?: PedidoStatus[];
  formaPagamento?: string[];
  dataInicial?: string;
  dataFinal?: string;
  busca?: string;
};

export type FiltrosEstoque = {
  categoria?: string[];
  ativo?: boolean;
  estoqueMinimo?: boolean;
  busca?: string;
};

// Configurações da aplicação
export type Configuracoes = {
  apiBaseUrl: string;
  timezone: string;
  taxaEntregaPadrao: number;
  formasPagamentoAtivas: string[];
  moeda: string;
  empresa: {
    nome: string;
    telefone?: string;
    endereco?: string;
  };
};

// Dashboard metrics
export type DashboardMetrics = {
  pedidosHoje: {
    total: number;
    pendentes: number;
    emPreparo: number;
    concluidos: number;
    faturamento: number;
  };
  estoque: {
    itensEstoqueBaixo: number;
    totalItens: number;
  };
  graficoPedidos: Array<{
    data: string;
    pedidos: number;
    faturamento: number;
  }>;
};