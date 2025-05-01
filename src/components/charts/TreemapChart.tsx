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
          .filter(([key]) => !['grand_total', 'grand_total_profit'].includes(key))
          .map(([institution, value]) => {
            const institutionData = value as any;
            return {
              name: institution,
              value: institutionData.total,
              children: Object.entries(institutionData.detail)
                .filter(([category]) => !category.endsWith('_收益')) // 过滤掉收益相关字段
                .map(([category, amount]) => ({
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
              return `${params.name}<br/>¥${value.toLocaleString('zh-CN')}`;
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
              formatter: function (params: any) {
                const value = params.value;
                return `${params.name}\n¥${value.toLocaleString('zh-CN')}`;
              },
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