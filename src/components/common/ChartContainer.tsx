import React, { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  useFixedHeight?: boolean; // 添加新属性控制是否使用固定高度
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  description, 
  children,
  useFixedHeight = true // 默认为true，保持与现有Dashboard行为一致
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className={useFixedHeight ? "h-[400px] md:h-[450px]" : ""}>
        {children}
      </div>
    </div>
  );
};