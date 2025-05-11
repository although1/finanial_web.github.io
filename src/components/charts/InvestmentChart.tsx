import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';

interface InvestmentChartProps {
  data: { data: FinancialData; date: string }[];
  type: 'usd' | 'cny' | 'fund' | 'stock';
  showAllDates?: boolean;
}

const INVESTMENT_CONFIG = {
  usd: {
    name: '美元理财',
    color: '#48BB78',
    profitKey: '美元理财_收益'
  },
  cny: {
    name: '人民币理财',
    color: '#3182CE',
    profitKey: '人民币理财_收益'
  },
  fund: {
    name: '基金',
    color: '#9F7AEA',
    profitKey: '基金_收益'
  },
  stock: {
    name: '股票',
    color: '#ED8936',
    profitKey: '股票_收益'
  }
} as const;

export const InvestmentChart: React.FC<InvestmentChartProps> = ({ 
  data, 
  type,
  showAllDates = false
}) => {
  const [options, setOptions] = useState({});
  const config = INVESTMENT_CONFIG[type];

  useEffect(() => {
    if (data && data.length > 1) {
      // Filter data if showAllDates is false
      const filteredData = showAllDates ? data : data.filter(item => item.date.endsWith('-01'));
      
      // Extract investment data for each date
      const investmentData = filteredData.map(item => {
        let total = 0;
        let totalProfit = 0;
        
        Object.entries(item.data).forEach(([institution, value]) => {
          if (institution !== 'grand_total' && typeof value === 'object') {
            const institutionData = value as any;
            if (institutionData.detail[config.name]) {
              total += institutionData.detail[config.name];
              if (institutionData.detail[config.profitKey]) {
                totalProfit += institutionData.detail[config.profitKey];
              }
            }
          }
        });
        
        return {
          date: item.date,
          value: total,
          profit: totalProfit
        };
      });

      // Calculate daily changes
      const changes = investmentData.slice(1).map((point, index) => {
        const change = point.value - investmentData[index].value;
        const profitChange = point.profit - investmentData[index].profit;
        return {
          value: change,
          profit: profitChange,
          itemStyle: {
            color: change >= 0 ? config.color : '#F56565'
          }
        };
      });

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params: any) {
            const value = params[0].value.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const profitValue = changes[params[0].dataIndex].profit.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return `${params[0].name}<br/>
                    资产变化: ￥${value}<br/>
                    收益变化: ￥${profitValue}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: investmentData.slice(1).map(item => item.date),
          axisLabel: {
            formatter: (value: string) => {
              return value.substring(5); // 只显示月-日
            },
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => `¥${value.toLocaleString('zh-CN')}`
          },
        },
        series: [
          {
            name: `${config.name}变化`,
            type: 'bar',
            data: changes.map(item => ({
              value: item.value,
              itemStyle: item.itemStyle
            })),
            label: {
              show: true,
              position: 'top',
              formatter: (params: any) => {
                return `￥${params.value.toLocaleString('zh-CN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`;
              }
            }
          }
        ],
        animation: true
      });
    }
  }, [data, type, showAllDates]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};
