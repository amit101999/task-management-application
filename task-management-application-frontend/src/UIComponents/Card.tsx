interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  );
};