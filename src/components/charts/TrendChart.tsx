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
          formatter: function(params: any) {
            let result = `${params[0].name}<br/>`;
            params.forEach((param: any) => {
              const value = param.value.toLocaleString('zh-CN');
              result += `${param.marker} ${param.seriesName}: ¥${value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['总资产', '总收益']
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
            formatter: (value: number) => `¥${value.toLocaleString('zh-CN')}`
          },
        },
        series: [
          {
            name: '总资产',
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
                    color: '#3182CE',
                  },
                  {
                    offset: 1,
                    color: '#63B3ED',
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
                    color: 'rgba(66, 153, 225, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(66, 153, 225, 0.05)',
                  },
                ],
              },
            },
          },
          {
            name: '总收益',
            type: 'line',
            data: data.map((item) => item.profit),
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#48BB78',
            },
            lineStyle: {
              width: 2,
              type: 'dashed',
            },
          },
        ],
        animation: true,
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};