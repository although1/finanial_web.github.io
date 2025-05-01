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
      const institutions = Object.keys(data).filter(
        (key) => key !== 'grand_total' && typeof data[key] === 'object'
      );

      const pieData = institutions.map((institution) => {
        const institutionData = data[institution] as any;
        return {
          name: institution,
          value: institutionData.total,
        };
      });

      // Generate color map for institutions
      const colorMap = generateColorMap(institutions);
      const colors = institutions.map((institution) => colorMap[institution]);

      setOptions({
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const value = params.value.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return `${params.name}<br/>￥${value} (${params.percent}%)`;
          },
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
                const value = params.value.toLocaleString('zh-CN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                });
                return `${params.name}\n￥${value}`;
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