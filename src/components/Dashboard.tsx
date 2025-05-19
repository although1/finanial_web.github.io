import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processFinancialData } from '../data/dataProcessor';
import { ProcessedData, InstitutionTotalTableRow } from '../data/dataTypes';
import { mockData } from '../data/mockData';
import { TrendChart } from './charts/TrendChart';
import { DetailedBarChart } from './charts/DetailedBarChart';
import { WaterfallChart } from './charts/WaterfallChart';
import { TreemapChart } from './charts/TreemapChart';
import { InvestmentChart } from './charts/InvestmentChart';
import { ChartContainer } from './common/ChartContainer';
import { LoadingIndicator } from './common/LoadingIndicator';
import { SummaryTable } from './common/SummaryTable';
import { InstitutionTotalTable } from './common/InstitutionTotalTable';

type ChartType = 'monthly' | 'usd' | 'cny'| 'fund'| 'stock';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProcessedData | null>(null);
  const [activeChart, setActiveChart] = useState<ChartType>('monthly');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAllDates, setShowAllDates] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [institutionTotalData, setInstitutionTotalData] = useState<InstitutionTotalTableRow[]>([]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('http://localhost:3000/api/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: 'tsx',
          args: ['src/data/convertJsonToMockData.ts']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync data');
      }

      const data = await response.json();
      console.log('Sync completed:', data);

      // 等待一秒，确保文件已经写入
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 重新加载数据
      const processedData = processFinancialData(mockData);
      setData(processedData);

      // 重新初始化日期选择
      if (mockData.length > 0) {
        const latestDate = mockData.reduce((latest, curr) => 
          new Date(curr.date) > new Date(latest) ? curr.date : latest
        , mockData[0].date);
        setSelectedDate(latestDate);
      }

    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'Error syncing data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      const processedData = processFinancialData(mockData);
      setData(processedData);
      
      // 处理机构总计数据
      const institutionTotals: InstitutionTotalTableRow[] = mockData.map(item => ({
        date: item.date,
        支付宝: item.data.支付宝?.total || 0,
        网商银行: item.data.网商银行?.total || 0,
        工行银行: item.data.工商银行?.total || 0,
        腾讯自选股: item.data.腾讯自选股?.total || 0,
        招商银行: item.data.招商银行?.total || 0,
        总计: item.data.grand_total
      }));
      setInstitutionTotalData(institutionTotals);

      // 找到最新日期并设置为默认选中日期
      if (mockData.length > 0) {
        const latestDate = mockData.reduce((latest, curr) => 
          new Date(curr.date) > new Date(latest) ? curr.date : latest
        , mockData[0].date);
        setSelectedDate(latestDate);
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading financial data. Please try again later.');
      setLoading(false);
    }
  }, []);

  // 获取选定日期的数据
  const getSelectedDateData = () => {
    if (!data || !selectedDate) return null;
    const selectedData = mockData.find(item => item.date === selectedDate);
    return selectedData ? selectedData.data : null;
  };

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/financial')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-md border border-blue-600 hover:border-blue-800"
            >
              理财详情
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 rounded-md border border-green-600 hover:border-green-800 flex items-center ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {syncing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  同步中...
                </>
              ) : (
                <>同步数据</>
              )}
            </button>
            <h2 className="text-xl font-bold text-gray-800">投资类型汇总</h2>
            <button
              onClick={() => setShowAllDates(!showAllDates)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                showAllDates
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showAllDates ? '显示所有日期' : '仅显示月初'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="dateSelect" className="text-sm text-gray-600">选择日期：</label>
            <select
              id="dateSelect"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mockData
                .filter(item => showAllDates || item.date.endsWith('-01'))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 按日期降序排序
                .map(item => (
                  <option key={item.date} value={item.date}>
                    {item.date}
                  </option>
              ))}
            </select>
          </div>
        </div>
        <SummaryTable data={getSelectedDateData() || data.latestData} />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
        <div>
          <ChartContainer 
            title="总资产趋势" 
            description="追踪您总资产随时间的变化趋势。"
          >
            <TrendChart 
              data={data.timeSeriesData}
              showAllDates={showAllDates}
            />
          </ChartContainer>
          
          <ChartContainer 
            title="机构资产总计表"
            description="各金融机构资产总额统计。"
          >
            <InstitutionTotalTable 
              data={institutionTotalData}
              showAllDates={showAllDates}
            />
          </ChartContainer>

          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">收益率与攒钱分析</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-2 border-b pb-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">收益率分析</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">最新总资产</p>
                    <p className="text-xl font-bold text-gray-900">
                      {data.latestData.grand_total.toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">目标年收益率</p>
                    <p className="text-xl font-bold text-blue-600">3.00%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">当年收益总额</p>
                    <p className={`text-xl font-bold ${data.yearToDateProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.yearToDateProfit.toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">月均收益</p>
                    <p className={`text-xl font-bold ${data.yearToDateProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(data.yearToDateProfit / data.savingsData.monthsPassed).toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">实际年化收益率</p>
                    <p className={`text-xl font-bold ${data.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.annualizedReturn.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">达标所需月份</p>
                    <p className="text-xl font-bold text-blue-600">
                      {Math.max(0, Math.ceil((data.latestData.grand_total * 0.03 - data.yearToDateProfit) / (data.yearToDateProfit / data.savingsData.monthsPassed)))}个月
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-md font-medium text-gray-700 mb-3">攒钱目标分析 (月标准¥12,500)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">当年已攒钱数</p>
                    <p className={`text-xl font-bold ${data.savingsData.yearToDateSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.savingsData.yearToDateSavings.toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">目标攒钱数</p>
                    <p className="text-xl font-bold text-blue-600">
                      {data.savingsData.yearSavingsTarget.toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">月均攒钱数</p>
                    <p className={`text-xl font-bold ${data.savingsData.averageMonthlySavings >= 12500 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.savingsData.averageMonthlySavings.toLocaleString('zh-CN', {
                        style: 'currency',
                        currency: 'CNY',
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">目标达成所需月份</p>
                    <p className="text-xl font-bold text-blue-600">
                      {Math.max(0, Math.ceil((150000 - data.savingsData.yearToDateSavings) / data.savingsData.averageMonthlySavings))}个月
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* <ChartContainer 
          title="最新日期资产分布" 
          description="按机构分类展示您最新日期的金融资产分布情况。"
        >
          <DistributionPieChart data={data.latestData} />
        </ChartContainer>
      </div> */}
      
      <ChartContainer 
        title={
          activeChart === 'monthly' ? "月度变化" :
          activeChart === 'usd' ? "美元投资月度变化" :
          activeChart === 'cny' ? "人民币理财月度变化" :
          activeChart === 'fund' ? "基金月度变化" :
          "股票月度变化"
        }
        description={
          activeChart === 'monthly' ? "总资产随时间变化的详细情况。" :
          activeChart === 'usd' ? "美元投资金额的变化。" :
          activeChart === 'cny' ? "人民币理财金额的变化。" :
          activeChart === 'fund' ? "基金金额的变化。" :
          "股票金额的变化。"
        }
      >
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={() => setActiveChart('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeChart === 'monthly'
                ? 'bg-blue-100 text-blue-700'
                : 'text-blue-600 hover:text-blue-800'
            } focus:outline-none`}
          >
            月度变化
          </button>
          <button
            onClick={() => setActiveChart('usd')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeChart === 'usd'
                ? 'bg-blue-100 text-blue-700'
                : 'text-blue-600 hover:text-blue-800'
            } focus:outline-none`}
          >
            美元投资
          </button>
          <button
            onClick={() => setActiveChart('cny')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeChart === 'cny'
                ? 'bg-blue-100 text-blue-700'
                : 'text-blue-600 hover:text-blue-800'
            } focus:outline-none`}
          >
            人民币理财
          </button>
          <button
            onClick={() => setActiveChart('fund')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeChart === 'fund'
                ? 'bg-blue-100 text-blue-700'
                : 'text-blue-600 hover:text-blue-800'
            } focus:outline-none`}
          >
            基金
          </button>
          <button
            onClick={() => setActiveChart('stock')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeChart === 'stock'
                ? 'bg-blue-100 text-blue-700'
                : 'text-blue-600 hover:text-blue-800'
            } focus:outline-none`}
          >
            股票
          </button>            
        </div>
        {activeChart === 'monthly' ? (
          <WaterfallChart 
            data={data.timeSeriesData}
            showAllDates={showAllDates}
          />
        ) : (
          <InvestmentChart 
            data={mockData} 
            type={activeChart} 
            showAllDates={showAllDates}
          />
        )}
      </ChartContainer>

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
  );
};

export default Dashboard;