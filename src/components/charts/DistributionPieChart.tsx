import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { FinancialData } from '../../data/dataTypes';
import { generateColorMap } from '../../data/dataProcessor';

interface DistributionPieChartProps {
  data: FinancialData;
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({ data }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      // Extract institutions and their totals
      const pieData = Object.entries(data)
        .filter(([key]) => !['grand_total', 'grand_total_profit'].includes(key))
        .map(([institution, value]) => ({
          name: institution,
          value: (value as any).total,
        }));

      // Generate color map for institutions
      const institutions = pieData.map((item) => item.name);
      const colorMap = generateColorMap(institutions);
      const colors = institutions.map((institution) => colorMap[institution]);

      setOptions({
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const value = params.value.toLocaleString('zh-CN');
            const percent = params.percent.toFixed(1);
            return `${params.name}<br/>¥${value} (${percent}%)`; 
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          type: 'scroll',
          formatter: (name: string) => {
            const item = pieData.find((d) => d.name === name);
            if (item) {
              const percentage = ((item.value / data.grand_total) * 100).toFixed(1);
              return `${name} (${percentage}%)`;
            }
            return name;
          },
        },
        series: [
          {
            name: 'Asset Distribution',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              formatter: (params: any) => {
                return `${params.name}\n¥${params.value.toLocaleString('zh-CN')}`;
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              show: false,
            },
            data: pieData,
            color: colors,
          },
        ],
        animation: true,
      });
    }
  }, [data]);

  return <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />;
};