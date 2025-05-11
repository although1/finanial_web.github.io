import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';

interface USDInvestmentChartProps {
  data: { data: FinancialData; date: string }[];
}

export const USDInvestmentChart: React.FC<USDInvestmentChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data && data.length > 1) {
      // Extract USD investment data for each date
      const usdData = data.map(item => {
        let totalUSD = 0;
        let totalUSDProfit = 0;
        Object.entries(item.data).forEach(([institution, value]) => {
          if (institution !== 'grand_total' && typeof value === 'object') {
            const institutionData = value as any;
            if (institutionData.detail['美元理财']) {
              totalUSD += institutionData.detail['美元理财'];
            }
            if (institutionData.detail['美元理财_收益']) {
              totalUSDProfit += institutionData.detail['美元理财_收益'];
            }
          }
        });
        return {
          date: item.date,
          value: totalUSD,
          profit: totalUSDProfit
        };
      });

      // Calculate daily changes
      const changes = usdData.slice(1).map((point, index) => {
        const change = point.value - usdData[index].value;
        const profit = point.profit - usdData[index].profit;
        return {
          value: change,
          itemStyle: {
            color: change >= 0 ? '#48BB78' : '#F56565'
          },
          profit: profit
        };
      });

      const dates = usdData.slice(1).map(point => point.date);

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
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
            name: '美元理财变化',
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