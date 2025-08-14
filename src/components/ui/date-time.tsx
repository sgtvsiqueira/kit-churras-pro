import { formatDate, formatDateTime, formatTime, formatRelativeDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface DateTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  date: string | Date;
  format?: 'date' | 'datetime' | 'time' | 'relative';
  variant?: 'default' | 'muted' | 'small';
}

const DateTime: React.FC<DateTimeProps> = ({ 
  date, 
  format = 'date', 
  variant = 'default',
  className,
  ...props 
}) => {
  const variantClasses = {
    default: 'text-base',
    muted: 'text-muted-foreground',
    small: 'text-sm'
  };

  const formatters = {
    date: formatDate,
    datetime: formatDateTime,
    time: formatTime,
    relative: formatRelativeDate
  };

  const formattedDate = formatters[format](date);
  const isoString = new Date(date).toISOString();

  return (
    <time 
      dateTime={isoString}
      className={cn(variantClasses[variant], className)} 
      {...props}
    >
      {formattedDate}
    </time>
  );
};

export { DateTime };