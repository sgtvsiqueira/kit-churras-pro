# 🔥 Kit Churras Pro

Sistema completo para gestão de delivery de **kits de churrasco** com foco em controle de estoque e pedidos.

## 🎯 Funcionalidades

### ✅ Implementado
- **Dashboard** com métricas em tempo real
- **Design System** completo com tema claro/escuro
- **Arquitetura preparada** para todas as funcionalidades
- **Mock API** com localStorage
- **Responsivo** mobile-first
- **Componentes reutilizáveis**

### 🚧 Em desenvolvimento
- **Controle de Pedidos** - CRUD completo, gestão de status, baixa automática de estoque
- **Controle de Estoque** - Itens, movimentações, ajustes, alertas de estoque baixo
- **Gestão de Kits** - Composição, preços, cálculo de margem
- **Clientes** - CRUD, histórico de pedidos
- **Configurações** - Parâmetros do sistema

## 🛠️ Stack Tecnológica

- **React** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **shadcn/ui** (componentes)
- **Zustand** (estado global)
- **React Router** (roteamento)
- **Lucide React** (ícones)

## 🚀 Como executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Layout da aplicação
│   └── dashboard/       # Componentes específicos do dashboard
├── domain/              # Tipos e definições do domínio
├── pages/               # Páginas da aplicação
├── services/            # Camada de serviços (API mock)
├── stores/              # Estado global (Zustand)
├── utils/               # Utilitários e formatters
└── assets/              # Imagens e recursos estáticos
```

## 🎨 Design System

O projeto utiliza um design system completo baseado em:
- **Paleta de cores** inspirada em churrasco (laranja/vermelho)
- **Tokens semânticos** para consistência
- **Gradientes e sombras** personalizados
- **Tema claro/escuro** com persistência
- **Componentes customizados** do shadcn/ui

## 🔌 Integração com API

O sistema utiliza uma camada de abstração em `/src/services/api.ts` que atualmente simula uma API com localStorage. Para integrar com backend real:

1. **Configure a URL da API**:
```env
VITE_API_BASE_URL=https://sua-api.com/api
```

2. **Substitua as funções mock** por chamadas HTTP reais:
```typescript
// Exemplo de migração
async function listPedidos(): Promise<Pedido[]> {
  const response = await fetch(`${API_BASE_URL}/pedidos`);
  return response.json();
}
```

## 🎯 Regras de Negócio

- **Baixa automática de estoque** ao mudar status para "EM_PREPARO"
- **Estorno automático** ao cancelar pedidos em preparo
- **Alertas de estoque baixo** no dashboard
- **Validação de disponibilidade** antes de finalizar pedidos
- **Cálculo automático** de custos e margens dos kits

## 📱 PWA Ready

O projeto está preparado para ser uma Progressive Web App com:
- Service Worker configurado
- Manifest para instalação
- Otimização para dispositivos móveis

## 🌐 Deploy

Para deploy em produção:

1. **Via Lovable**: Clique em "Share → Publish"
2. **Manual**: Execute `npm run build` e hospede a pasta `dist`

## 📞 Suporte

Para dúvidas ou sugestões sobre o projeto, utilize os recursos do Lovable ou contribua diretamente no código.
# Teste workflow Docker
