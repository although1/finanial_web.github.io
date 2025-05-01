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
        Object.entries(item.data).forEach(([institution, value]) => {
          if (institution !== 'grand_total' && typeof value === 'object') {
            const institutionData = value as any;
            if (institutionData.detail['美元理财']) {
              totalUSD += institutionData.detail['美元理财'];
            }
          }
        });
        return {
          date: item.date,
          value: totalUSD
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
            type: 'shadow'
          },
          formatter: (params: any) => {
            const value = params[0].value;
            const formattedValue = Math.abs(value).toLocaleString('zh-CN', {
              style: 'currency',
              currency: 'CNY',
              minimumFractionDigits: 2
            });
            const direction = value >= 0 ? '增加' : '减少';
            return `${params[0].name}<br/>美元理财${direction}: ${formattedValue}`;
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
              if (Math.abs(value) >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value.toString();
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