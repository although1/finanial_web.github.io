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
        <h2 className="text-xl font-bold text-gray-800 mb-4">投资类型汇总</h2>
        <SummaryTable data={data.latestData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="Total Assets Over Time" 
          description="Track the changes in your total financial assets over time."
        >
          <TrendChart data={data.timeSeriesData} />
        </ChartContainer>
        
        <ChartContainer 
          title="Latest Asset Distribution" 
          description="Breakdown of your financial assets by institution for the most recent date."
        >
          <DistributionPieChart data={data.latestData} />
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="Month-over-Month Changes" 
          description="Visualize how your total assets changed over time with detailed breakdowns."
        >
          <WaterfallChart data={data.timeSeriesData} />
        </ChartContainer>

        <ChartContainer 
          title="USD Investment Daily Changes" 
          description="Track daily changes in USD investment amounts across all institutions."
        >
          <USDInvestmentChart data={mockData} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer 
          title="Asset Hierarchy View" 
          description="Hierarchical visualization of your entire investment portfolio."
        >
          <TreemapChart data={data.latestData} />
        </ChartContainer>

        <ChartContainer 
          title="Detailed Category Breakdown" 
          description="Detailed view of asset categories within each financial institution."
        >
          <DetailedBarChart data={data.latestData} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard