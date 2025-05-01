import React, { useEffect, useState } from 'react';
import { processFinancialData } from '../data/dataProcessor';
import { FinancialData, ProcessedData } from '../data/dataTypes';
import { mockData } from '../data/mockData';
import { TrendChart } from './charts/TrendChart';
import { DistributionPieChart } from './charts/DistributionPieChart';
import { DetailedBarChart } from './charts/DetailedBarChart';
import { WaterfallChart } from './charts/WaterfallChart';
import { TreemapChart } from './charts/TreemapChart';
import { USDInvestmentChart } from './charts/USDInvestmentChart';
import { ChartContainer } from './common/ChartContainer';
import { LoadingIndicator } from './common/LoadingIndicator';
import { SummaryTable } from './common/SummaryTable';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const processedData = processFinancialData(mockData);
      setData(processedData);
      setLoading(false);
    } catch (err) {
      setError('Error loading financial data. Please try again later.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!data) {
    return <div className="text-center p-8">No data available.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">最新日期投资类型汇总</h2>
        <SummaryTable data={data.latestData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="总资产趋势" 
          description="追踪您总资产随时间的变化趋势。"
        >
          <TrendChart data={data.timeSeriesData} />
        </ChartContainer>
        
        <ChartContainer 
          title="最新日期资产分布" 
          description="按机构分类展示您最新日期的金融资产分布情况。"
        >
          <DistributionPieChart data={data.latestData} />
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="月度变化" 
          description="可视化展示您总资产随时间变化的详细情况。"
        >
          <WaterfallChart data={data.timeSeriesData} />
        </ChartContainer>

        <ChartContainer 
          title="美元投资每日变化" 
          description="追踪所有机构美元投资金额的每日变化。"
        >
          <USDInvestmentChart data={mockData} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="最新日期资产层级视图" 
          description="您整个投资组合的层级可视化展示。"
        >
          <TreemapChart data={data.latestData} />
        </ChartContainer>

        <ChartContainer 
          title="最新日期详细类别分析" 
          description="展示每个金融机构内部资产类别的详细情况。"
        >
          <DetailedBarChart data={data.latestData} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;