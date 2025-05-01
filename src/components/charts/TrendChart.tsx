import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TimeSeriesPoint } from '../../data/dataTypes';

interface TrendChartProps {
  data: TimeSeriesPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data && data.length) {
      setOptions({
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const dataIndex = params[0].dataIndex;
            const date = data[dataIndex].date;
            const value = `￥${data[dataIndex].value.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
            return `${date}<br/>总额: <strong>${value}</strong>`;
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.date),
          boundaryGap: false,
          axisLabel: {
            formatter: (value: string) => {
              // Format date for better readability
              const date = new Date(value);
              return date.toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
              });
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              return (value / 1000).toFixed(0) + 'k';
            },
          },
        },
        series: [
          {
            name: 'Total Assets',
            type: 'line',
            data: data.map((item) => item.value),
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#4299E1',
            },
            lineStyle: {
              width: 3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#3182CE', // blue-600
                  },
                  {
                    offset: 1,
                    color: '#63B3ED', // blue-400
                  },
                ],
              },
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(66, 153, 225, 0.3)', // blue-500 with opacity
                  },
                  {
                    offset: 1,
                    color: 'rgba(66, 153, 225, 0.05)', // blue-500 with low opacity
                  },
                ],
              },
            },
            markPoint: {
              data: [
                { type: 'max', name: '最高' },
                { type: 'min', name: '最低' },
              ],
              label: {
                formatter: (params: any) => {
                  return `￥${params.value.toLocaleString('zh-CN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`;
                },
              },
            },
          },
        ],
        animation: true,
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};