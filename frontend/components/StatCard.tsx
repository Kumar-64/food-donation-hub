import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  className?: string;
  iconClassName?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{label}</span>
        {icon && (
          <div
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center',
              iconClassName || 'bg-primary-light text-primary'
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text">{value}</div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={cn(
              'text-xs font-medium',
              trendDirection === 'up' && 'text-green-600',
              trendDirection === 'down' && 'text-red-600',
              trendDirection === 'neutral' && 'text-text-secondary'
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
