export const Input = ({ 
  label, 
  icon, 
  className = '', 
  handleChange,
  value,
  ...props 
} : InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base
            ${icon ? 'pl-10 sm:pl-11' : ''}
            ${className}
          `}
          {...props}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};