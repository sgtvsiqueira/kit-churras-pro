import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        pendente: "bg-warning/10 text-warning-foreground border border-warning/20",
        emPreparo: "bg-info/10 text-info-foreground border border-info/20",
        saiuParaEntrega: "bg-primary/10 text-primary-foreground border border-primary/20",
        concluido: "bg-accent/10 text-accent-foreground border border-accent/20",
        cancelado: "bg-destructive/10 text-destructive-foreground border border-destructive/20",
        estoqueBaixo: "bg-destructive/10 text-destructive-foreground border border-destructive/20",
        estoqueOk: "bg-accent/10 text-accent-foreground border border-accent/20",
        estoqueAlerta: "bg-warning/10 text-warning-foreground border border-warning/20",
        ativo: "bg-accent/10 text-accent-foreground border border-accent/20",
        inativo: "bg-muted text-muted-foreground border border-muted",
      }
    },
    defaultVariants: {
      variant: "pendente",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };