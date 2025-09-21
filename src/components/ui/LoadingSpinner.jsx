import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'default', 
  color = 'blue',
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        className={cn(
          'animate-spin',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = 'Đang tải...',
  className 
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            {message && (
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingPage = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ 
  lines = 3, 
  className,
  avatar = false,
  title = false 
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        )}
        <div className="flex-1 space-y-2">
          {title && (
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          )}
          {[...Array(lines)].map((_, i) => (
            <div 
              key={i} 
              className={`h-3 bg-gray-300 rounded ${
                i === lines - 1 ? 'w-2/3' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { 
  LoadingSpinner, 
  LoadingOverlay, 
  LoadingPage, 
  LoadingSkeleton 
};
