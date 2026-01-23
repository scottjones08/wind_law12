import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-sm' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-lg' },
};

const colorClasses = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-rose-500',
];

function getColorClass(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorClasses[hash % colorClasses.length];
}

export function Avatar({ src, firstName = '', lastName = '', size = 'md', className }: AvatarProps) {
  const styles = sizeStyles[size];
  const initials = getInitials(firstName, lastName);
  const colorClass = getColorClass(`${firstName}${lastName}`);

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn(styles.container, 'rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        styles.container,
        colorClass,
        'rounded-full flex items-center justify-center',
        className
      )}
    >
      <span className={cn(styles.text, 'font-medium text-white')}>
        {initials}
      </span>
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export function AvatarGroup({ children, max = 4, className }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="ring-2 ring-white rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
