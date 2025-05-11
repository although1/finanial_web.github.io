import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';

interface CNYInvestmentChartProps {
  data: { data: FinancialData; date: string }[];
}

export const CNYInvestmentChart: React.FC<CNYInvestmentChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data && data.length > 1) {
      // Extract CNY investment data for each date
      const usdData = data.map(item => {
        let totalCNY = 0;
        Object.entries(item.data).forEach(([institution, value]) => {
          if (institution !== 'grand_total' && typeof value === 'object') {
            const institutionData = value as any;
            if (institutionData.detail['人民币理财']) {
              totalCNY += institutionData.detail['人民币理财'];
            }
          }
        });
        return {
          date: item.date,
          value: totalCNY
        };
      });

      // Calculate daily changes
      const changes = usdData.slice(1).map((point, index) => {
        const change = point.value - usdData[index].value;
        return {
          value: change,
          itemStyle: {
            color: change >= 0 ? '#48BB78' : '#F56565'
          }
        };
      });

      const dates = usdData.slice(1).map(point => point.date);

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params: any) {
            let result = `${params[0].name}<br/>`;
            params.forEach((param: any) => {
              const value = param.value.toLocaleString('zh-CN');
              result += `${param.marker} ${param.seriesName}: ¥${value}<br/>`;
            });
            return result;
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
          name: '投资金额',
          axisLabel: {
            formatter: (value: number) => `¥${value.toLocaleString('zh-CN')}`
          },
        },
        series: [
          {
            name: '人民币理财变化',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
              formatter: (params: any) => {
                const value = params.value;
                if (value >= 0) {
                  return '+' + value.toFixed(0);
                }
                return value.toFixed(0);
              }
            },
            data: changes
          }
        ],
        animation: true
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};
