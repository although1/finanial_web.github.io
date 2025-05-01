import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TimeSeriesPoint } from '../../data/dataTypes';

interface WaterfallChartProps {
  data: TimeSeriesPoint[];
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data && data.length > 1) {
      const changes = data.slice(1).map((point, index) => {
        const change = point.value - data[index].value;
        return {
          value: change,
          itemStyle: {
            color: change >= 0 ? '#48BB78' : '#F56565'
          }
        };
      });

      const dates = data.slice(1).map(point => point.date);

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
            return `${params[0].name}<br/>￥${value}`;
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
                day: 'numeric',
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
            name: 'Change',
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
            data: changes
          }
        ],
        animation: true
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};