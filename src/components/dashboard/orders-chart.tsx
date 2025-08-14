import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatDate } from "@/utils/formatters";
import { DashboardMetrics } from "@/domain/types";
import { TrendingUp } from "lucide-react";

interface OrdersChartProps {
  data: DashboardMetrics['graficoPedidos'];
}

export const OrdersChart: React.FC<OrdersChartProps> = ({ data }) => {
  const maxPedidos = Math.max(...data.map(d => d.pedidos));
  const maxFaturamento = Math.max(...data.map(d => d.faturamento));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Pedidos dos Últimos 7 Dias
        </CardTitle>
        <CardDescription>
          Acompanhe o desempenho diário de pedidos e faturamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Pedidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span>Faturamento</span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {formatDate(item.data, { day: '2-digit', month: '2-digit' })}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-primary font-medium">
                      {item.pedidos} pedidos
                    </span>
                    <span className="text-accent font-medium">
                      {formatMoney(item.faturamento)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 h-2">
                  {/* Pedidos bar */}
                  <div className="flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: maxPedidos > 0 ? `${(item.pedidos / maxPedidos) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  
                  {/* Faturamento bar */}
                  <div className="flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ 
                        width: maxFaturamento > 0 ? `${(item.faturamento / maxFaturamento) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {data.reduce((acc, item) => acc + item.pedidos, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {formatMoney(data.reduce((acc, item) => acc + item.faturamento, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Faturamento Total</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};