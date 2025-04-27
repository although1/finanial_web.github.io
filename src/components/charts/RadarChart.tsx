import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';
import { generateColorMap } from '../../data/dataProcessor';

interface RadarChartProps {
  data: FinancialData;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      const institutions = Object.keys(data).filter(
        key => key !== 'grand_total' && typeof data[key] === 'object'
      );

      // Get all unique categories
      const categories = new Set<string>();
      institutions.forEach(institution => {
        const institutionData = data[institution] as any;
        Object.keys(institutionData.detail).forEach(category => {
          categories.add(category);
        });
      });

      const indicator = Array.from(categories).map(category => ({
        name: category,
        max: Math.max(...institutions.map(institution => {
          const institutionData = data[institution] as any;
          return institutionData.detail[category] || 0;
        })) * 1.2
      }));

      const seriesData = institutions.map(institution => {
        const institutionData = data[institution] as any;
        return {
          value: indicator.map(ind => institutionData.detail[ind.name] || 0),
          name: institution
        };
      });

      const colorMap = generateColorMap(institutions);
      const colors = institutions.map(institution => colorMap[institution]);

      setOptions({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          data: institutions
        },
        radar: {
          indicator: indicator,
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: '#666',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: ['#ddd']
            }
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            type: 'radar',
            data: seriesData,
            symbol: 'none',
            lineStyle: {
              width: 2
            },
            emphasis: {
              focus: 'series'
            },
            color: colors
          }
        ],
        animation: true
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};