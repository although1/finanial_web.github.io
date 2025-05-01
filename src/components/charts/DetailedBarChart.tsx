import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';
import { generateColorMap } from '../../data/dataProcessor';

interface DetailedBarChartProps {
  data: FinancialData;
}

export const DetailedBarChart: React.FC<DetailedBarChartProps> = ({ data }) => {
  // 获取所有机构
  const institutions = Object.keys(data).filter(
    (key) => !['grand_total', 'grand_total_profit'].includes(key)
  );

  // 获取所有产品类别（过滤掉收益相关字段）
  const categories = new Set<string>();
  institutions.forEach((institution) => {
    Object.keys(data[institution].detail).forEach((category) => {
      if (!category.endsWith('_收益')) {
        categories.add(category);
      }
    });
  });

  const categoryList = Array.from(categories);
  const colorMap = generateColorMap(categoryList);

  // 准备系列数据
  const series = categoryList.map((category) => ({
    name: category,
    type: 'bar',
    stack: 'total',
    emphasis: {
      focus: 'series',
    },
    data: institutions.map((institution) => data[institution].detail[category] || 0),
    itemStyle: {
      color: colorMap[category],
    },
  }));

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`;
        let total = 0;
        params.forEach((param: any) => {
          if (param.value > 0) {
            const value = param.value.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            result += `${param.seriesName}: ￥${value}<br/>`;
            total += param.value;
          }
        });
        result += `总计: ￥${total.toLocaleString('zh-CN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        return result;
      },
    },
    legend: {
      data: categoryList,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: institutions,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          return value.toLocaleString('zh-CN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        },
      },
    },
    series,
    animation: true,
  };

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};