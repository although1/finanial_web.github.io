import React from 'react';
import { FinancialData } from '../../data/dataTypes';

interface SummaryTableProps {
  data: FinancialData;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  // Calculate totals and profits for each investment type across all institutions
  const calculateTotals = () => {
    const totals: { [key: string]: { amount: number; profit: number } } = {};
    
    Object.keys(data).forEach(institution => {
      if (institution !== 'grand_total' && institution !== 'grand_total_profit' && typeof data[institution] === 'object') {
        const institutionData = data[institution] as any;
        Object.entries(institutionData.detail).forEach(([category, value]) => {
          if (!category.endsWith('_收益')) {
            const profitKey = `${category}_收益`;
            const profit = institutionData.detail[profitKey] || 0;
            
            if (!totals[category]) {
              totals[category] = { amount: 0, profit: 0 };
            }
            totals[category].amount += value as number;
            totals[category].profit += profit;
          }
        });
      }
    });
    
    return Object.entries(totals)
      .sort((a, b) => b[1].amount - a[1].amount); // Sort by amount in descending order
  };

  const totals = calculateTotals();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              投资类型
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">
              总金额 (CNY)
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">
              收益 (CNY)
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">
              占比
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {totals.map(([category, { amount, profit }], index) => {
            const percentage = ((amount / (data.grand_total as number)) * 100).toFixed(2);
            return (
              <tr 
                key={category}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {category}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                  {amount.toLocaleString('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                    minimumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                  {profit.toLocaleString('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                    minimumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                  {percentage}%
                </td>
              </tr>
            );
          })}
          <tr className="bg-blue-50 font-semibold">
            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
              总计
            </td>
            <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
              {(data.grand_total as number).toLocaleString('zh-CN', {
                style: 'currency',
                currency: 'CNY',
                minimumFractionDigits: 2
              })}
            </td>
            <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
              {((data.grand_total_profit || 0) as number).toLocaleString('zh-CN', {
                style: 'currency',
                currency: 'CNY',
                minimumFractionDigits: 2
              })}
            </td>
            <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
              100.00%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};