import React from 'react';
import { FinancialData } from '../../data/dataTypes';

interface SummaryTableProps {
  data: FinancialData;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  // Calculate totals for each investment type across all institutions
  const calculateTotals = () => {
    const totals: { [key: string]: number } = {};
    
    Object.keys(data).forEach(institution => {
      if (institution !== 'grand_total' && typeof data[institution] === 'object') {
        const institutionData = data[institution] as any;
        Object.entries(institutionData.detail).forEach(([category, amount]) => {
          totals[category] = (totals[category] || 0) + (amount as number);
        });
      }
    });
    
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1]); // Sort by amount in descending order
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
              占比
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {totals.map(([category, amount], index) => {
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
              100.00%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};