import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'border-border',
    primary: 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10',
    success: 'border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10',
    warning: 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10',
    danger: 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10',
  };

  const iconVariantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-accent',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <Card className={cn(variantClasses[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", iconVariantClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-accent" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};