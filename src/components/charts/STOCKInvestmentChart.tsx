import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';

interface STOCKInvestmentChartProps {
  data: { data: FinancialData; date: string }[];
}

export const STOCKInvestmentChart: React.FC<STOCKInvestmentChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data && data.length > 1) {
      // Extract STOCK investment data for each date
      const stockData = data.map(item => {
        let totalSTOCK = 0;
        let totalSTOCKProfit = 0;
        Object.entries(item.data).forEach(([institution, value]) => {
          if (institution !== 'grand_total' && typeof value === 'object') {
            const institutionData = value as any;
            if (institutionData.detail['股票']) {
              totalSTOCK += institutionData.detail['股票'];
            }
            if (institutionData.detail['股票_收益']) {
              totalSTOCKProfit += institutionData.detail['股票_收益'];
            }
          }
        });
        return {
          date: item.date,
          value: totalSTOCK,
          profit: totalSTOCKProfit
        };
      });

      // Calculate daily changes
      const changes = stockData.slice(1).map((point, index) => {
        const change = point.value - stockData[index].value;
        const profit = point.profit - stockData[index].profit;
        return {
          value: change,
          itemStyle: {
            color: change >= 0 ? '#48BB78' : '#F56565'
          },
          profit: profit
        };
      });

      const dates = stockData.slice(1).map(point => point.date);

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params: any) => {
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
        },        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            formatter: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric'
              });
            },
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              return `￥${(value / 1000).toLocaleString('zh-CN')}k`;
            }
          }
        },
        series: [
          {
            name: '股票变化',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
              formatter: (params: any) => {
                return `￥${params.value.toLocaleString('zh-CN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`;
              }
            },
            data: changes.map(item => ({
              value: item.value,
              itemStyle: item.itemStyle
            }))
          }
        ],
        animation: true
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};
