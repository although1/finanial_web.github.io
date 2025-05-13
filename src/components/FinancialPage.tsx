import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDInvestmentTable } from './common/USDInvestmentTable';
import { usdInvestmentData } from '../data/usdInvestmentData';

const FinancialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-md border border-blue-600 hover:border-blue-800"
        >
          返回主页
        </button>
        <h1 className="text-2xl font-bold text-gray-800">理财详情</h1>
      </div>

      <ChartContainer 
        title="美元理财产品详情" 
        description="展示所有美元理财产品的详细信息。"
      >
        <USDInvestmentTable data={usdInvestmentData} />
      </ChartContainer>
    </div>
  );
};

export default FinancialPage;
