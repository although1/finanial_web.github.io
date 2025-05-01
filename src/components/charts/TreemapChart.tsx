import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';

interface TreemapChartProps {
  data: FinancialData;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      const treeData = {
        name: '总资产',
        children: Object.entries(data)
          .filter(([key]) => key !== 'grand_total')
          .map(([institution, value]) => {
            const institutionData = value as any;
            return {
              name: institution,
              value: institutionData.total,
              children: Object.entries(institutionData.detail).map(([category, amount]) => ({
                name: category,
                value: amount,
              })),
            };
          }),
      };

      setOptions({
        tooltip: {
          formatter: (params: any) => {
            const value = params.value;
            if (value) {
              const formattedValue = value.toLocaleString('zh-CN', {
                style: 'currency',
                currency: 'CNY',
                minimumFractionDigits: 2,
              });
              return `${params.name}<br/>${formattedValue}`;
            }
            return params.name;
          },
        },
        series: [
          {
            name: '资产分布',
            type: 'treemap',
            data: treeData.children,
            levels: [
              {
                itemStyle: {
                  borderWidth: 3,
                  borderColor: '#fff',
                  gapWidth: 3,
                },
              },
              {
                colorSaturation: [0.3, 0.6],
                itemStyle: {
                  borderWidth: 2,
                  gapWidth: 2,
                  borderColorSaturation: 0.7,
                },
              },
            ],
            breadcrumb: {
              show: false,
            },
            label: {
              show: true,
              formatter: '{b}\n{c}元',
            },
            upperLabel: {
              show: true,
              height: 30,
            },
            itemStyle: {
              borderColor: '#fff',
            },
          },
        ],
        animation: true,
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};