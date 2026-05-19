import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-indigo-500 ${sizes[size]}`} />
    </div>
  );
};

export default LoadingSpinner;
