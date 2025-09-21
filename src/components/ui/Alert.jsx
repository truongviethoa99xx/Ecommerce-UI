import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600',
        destructive: 'bg-red-50 border-red-200 text-red-800 [&>svg]:text-red-600',
        success: 'bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-600',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = ({ 
  className, 
  variant, 
  children, 
  onClose,
  ...props 
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'destructive':
        return <XCircleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {getIcon()}
      <div className="flex-1">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const AlertTitle = ({ className, children, ...props }) => (
  <h5
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h5>
);

const AlertDescription = ({ className, children, ...props }) => (
  <div
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  >
    {children}
  </div>
);

export { Alert, AlertTitle, AlertDescription };
