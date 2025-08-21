import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Plus,
  PackagePlus,
  Store,
  ExternalLink
} from "lucide-react";

import { usePedidosStore } from "@/stores/usePedidosStore";
import { useEstoqueStore } from "@/stores/useEstoqueStore";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPedidoStatus } from "@/utils/formatters";
import { StatusBadge } from "@/components/ui/status-badge";

export default function Dashboard() {
  const { 
    dashboardMetrics, 
    loadingDashboard, 
    loadDashboard 
  } = usePedidosStore();
  
  const { 
    getItensEstoqueBaixo, 
    itens,
    loadItens 
  } = useEstoqueStore();

  useEffect(() => {
    loadDashboard();
    loadItens();
  }, [loadDashboard, loadItens]);

  const itensEstoqueBaixo = getItensEstoqueBaixo();

  if (loadingDashboard || !dashboardMetrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/pedidos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/estoque?tab=entrada">
              <PackagePlus className="h-4 w-4 mr-2" />
              Entrada Estoque
            </Link>
          </Button>
        </div>
      </div>

      {/* Card de Destaque da Loja */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-orange-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Store className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl text-primary">Loja Online</CardTitle>
              </div>
              <CardDescription className="text-base">
                Sua loja de kits de churrasco está pronta! Clientes podem fazer pedidos diretamente.
              </CardDescription>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="/loja" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Loja
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-primary">✓</span> Kit Abraãozinho (7 pessoas)
            </div>
            <div>
              <span className="font-medium text-primary">✓</span> Kit Lopes Mendes (12 pessoas)
            </div>
            <div>
              <span className="font-medium text-primary">✓</span> Sistema de trocas de itens
            </div>
            <div>
              <span className="font-medium text-primary">✓</span> Itens extras disponíveis
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Pedidos Hoje"
          value={dashboardMetrics.pedidosHoje.total}
          description={`${dashboardMetrics.pedidosHoje.pendentes} pendentes`}
          icon={ShoppingCart}
          variant="primary"
        />
        
        <MetricsCard
          title="Faturamento Hoje"
          value={formatMoney(dashboardMetrics.pedidosHoje.faturamento)}
          description={`${dashboardMetrics.pedidosHoje.concluidos} concluídos`}
          icon={DollarSign}
          variant="success"
        />
        
        <MetricsCard
          title="Itens em Estoque"
          value={dashboardMetrics.estoque.totalItens}
          description="Itens ativos"
          icon={Package}
        />
        
        <MetricsCard
          title="Estoque Baixo"
          value={dashboardMetrics.estoque.itensEstoqueBaixo}
          description="Requerem atenção"
          icon={AlertTriangle}
          variant={dashboardMetrics.estoque.itensEstoqueBaixo > 0 ? "warning" : "default"}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <OrdersChart data={dashboardMetrics.graficoPedidos} />
        </div>

        {/* Quick Info */}
        <div className="space-y-4">
          {/* Status dos Pedidos Hoje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pedidos Hoje por Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { status: 'PENDENTE', count: dashboardMetrics.pedidosHoje.pendentes, variant: 'pendente' as const },
                { status: 'EM_PREPARO', count: dashboardMetrics.pedidosHoje.emPreparo, variant: 'emPreparo' as const },
                { status: 'CONCLUIDO', count: dashboardMetrics.pedidosHoje.concluidos, variant: 'concluido' as const },
              ].map(({ status, count, variant }) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge variant={variant}>
                    {formatPedidoStatus(status)}
                  </StatusBadge>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Itens com Estoque Baixo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estoque Baixo</CardTitle>
              <CardDescription>
                Itens que precisam de reposição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {itensEstoqueBaixo.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Todos os itens estão com estoque adequado! 🎉
                </p>
              ) : (
                <div className="space-y-2">
                  {itensEstoqueBaixo.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="flex-1 truncate">{item.nome}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {item.estoqueAtual} {item.unidade}
                        </span>
                        <StatusBadge variant="estoqueBaixo" className="text-xs">
                          Baixo
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                  {itensEstoqueBaixo.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                      <Link to="/estoque">
                        Ver todos ({itensEstoqueBaixo.length})
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}