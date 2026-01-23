import { cn } from '@/lib/utils';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  showLabel,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
