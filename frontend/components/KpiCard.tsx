import { cn, formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export default function KpiCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
}: KpiCardProps) {
  const formattedValue =
    typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold text-text">{formattedValue}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === 'positive' && (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              )}
              {changeType === 'negative' && (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              {changeType === 'neutral' && (
                <Minus className="w-3.5 h-3.5 text-text-secondary" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  changeType === 'positive' && 'text-green-600',
                  changeType === 'negative' && 'text-red-600',
                  changeType === 'neutral' && 'text-text-secondary'
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
