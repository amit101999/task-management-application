


export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'lg', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm',
    google: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500 shadow-sm'
  };
  
  const sizes = {
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
/*******  988ab1e1-96bb-4929-828c-f8bbdc3d0b64  *******/
      {...props}
    >
      {children}
    </button>
  );
};