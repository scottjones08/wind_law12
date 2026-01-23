import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor = 'text-primary-600',
  iconBgColor = 'bg-primary-50',
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-soft transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className={cn('p-3 rounded-xl', iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              isPositive && 'text-green-700 bg-green-50',
              isNegative && 'text-red-700 bg-red-50',
              isNeutral && 'text-gray-600 bg-gray-50'
            )}
          >
            {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
            {isNeutral && <Minus className="w-3.5 h-3.5" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
