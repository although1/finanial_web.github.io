import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';
import { generateColorMap } from '../../data/dataProcessor';

interface DetailedBarChartProps {
  data: FinancialData;
}

export const DetailedBarChart: React.FC<DetailedBarChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      // Extract institutions and categories
      const institutions = Object.keys(data).filter(
        (key) => key !== 'grand_total' && typeof data[key] === 'object'
      );

      // Extract all unique categories across all institutions
      const allCategories = new Set<string>();
      institutions.forEach((institution) => {
        const institutionData = data[institution] as any;
        Object.keys(institutionData.detail).forEach((category) => {
          allCategories.add(category);
        });
      });
      const categories = Array.from(allCategories);

      // Generate series data for each category
      const seriesData = categories.map((category) => {
        return {
          name: category,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: institutions.map((institution) => {
            const institutionData = data[institution] as any;
            return institutionData.detail[category] || 0;
          }),
        };
      });

      // Generate color map for categories
      const colorMap = generateColorMap(categories);
      const colors = categories.map((category) => colorMap[category]);

      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: any) => {
            const institutionIndex = params[0].dataIndex;
            const institution = institutions[institutionIndex];
            
            let content = `<strong>${institution}</strong><br/>`;
            
            params.forEach((param: any) => {
              if (param.value > 0) {
                const formattedValue = param.value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'CNY',
                  minimumFractionDigits: 2,
                });
                content += `${param.seriesName}: ${formattedValue}<br/>`;
              }
            });
            
            return content;
          },
        },
        legend: {
          data: categories,
          bottom: 0,
          type: 'scroll',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: institutions,
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 10000) {
                return (value / 10000).toFixed(0) + '万';
              }
              return value.toString();
            },
          },
        },
        series: seriesData,
        color: colors,
        animation: true,
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};