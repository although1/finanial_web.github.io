import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="h-[400px] md:h-[450px]">
        {children}
      </div>
    </div>
  );
};