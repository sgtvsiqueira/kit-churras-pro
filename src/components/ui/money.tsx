import { formatMoney } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  variant?: 'default' | 'large' | 'small' | 'muted';
}

const Money: React.FC<MoneyProps> = ({ 
  value, 
  variant = 'default', 
  className, 
  ...props 
}) => {
  const variantClasses = {
    default: 'text-base font-medium',
    large: 'text-lg font-semibold',
    small: 'text-sm',
    muted: 'text-sm text-muted-foreground'
  };

  return (
    <span 
      className={cn(variantClasses[variant], className)} 
      {...props}
    >
      {formatMoney(value)}
    </span>
  );
};

export { Money };