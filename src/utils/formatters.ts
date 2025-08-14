/**
 * Formatadores para uso em todo o app - padrão pt-BR
 */

// Configuração padrão para timezone
const TIMEZONE = 'America/Sao_Paulo';

/**
 * Formatar valores monetários em Real (BRL)
 */
export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formatar datas em pt-BR
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TIMEZONE,
  };
  
  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(
    new Date(date)
  );
};

/**
 * Formatar data e hora em pt-BR
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatar apenas horário
 */
export const formatTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  }).format(new Date(date));
};

/**
 * Formatar data relativa (ex: "há 2 dias")
 */
export const formatRelativeDate = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Agora mesmo';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`;
  
  return formatDate(date);
};

/**
 * Formatar números com separadores pt-BR
 */
export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formatar porcentagem
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Aplicar máscara de telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Aplicar máscara de CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

/**
 * Aplicar máscara de CNPJ
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

/**
 * Formatar unidades de medida
 */
export const formatUnit = (quantity: number, unit: string): string => {
  const unitLabels: Record<string, string> = {
    'un': 'un',
    'kg': 'kg',
    'g': 'g',
    'ml': 'ml',
    'l': 'L',
    'pct': 'pct',
  };
  
  const formattedQuantity = formatNumber(quantity, unit === 'kg' || unit === 'l' ? 2 : 0);
  const unitLabel = unitLabels[unit] || unit;
  
  return `${formattedQuantity} ${unitLabel}`;
};

/**
 * Truncar texto
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Capitalize primeira letra
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatar status de pedido
 */
export const formatPedidoStatus = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'PENDENTE': 'Pendente',
    'EM_PREPARO': 'Em Preparo',
    'SAIU_PARA_ENTREGA': 'Saiu para Entrega',
    'CONCLUIDO': 'Concluído',
    'CANCELADO': 'Cancelado',
  };
  
  return statusLabels[status] || status;
};

/**
 * Gerar initials de um nome
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};