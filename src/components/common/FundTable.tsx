import React from 'react';
import { FundDetailWithDates } from '../../data/dataTypes';

interface FundInvestmentTableProps {
  fundData: FundDetailWithDates[];
  onDelete?: (item: FundDetailWithDates) => void;
  onUpdateItem?: (index: number, updates: Partial<FundDetailWithDates>) => void;
}

export const FundTable_A: React.FC<FundInvestmentTableProps> = ({
  fundData,
  onDelete,
  onUpdateItem
}) => {
  const handleValueChange = (index: number, value: string) => {
    if (!onUpdateItem) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const item = fundData[index];
    const currentFund = numValue;
    const profit = parseFloat((currentFund - item.initialFund).toFixed(2));

    onUpdateItem(index, {
      currentFund,
      profit
    });
  };

  // 计算总计数据
  const totals = fundData.reduce((acc, curr) => ({
    initialFund: acc.initialFund + curr.initialFund,
    currentFund: acc.currentFund + curr.currentFund,
    profit: acc.profit + curr.profit,
  }), {
    initialFund: 0,
    currentFund: 0,
    profit: 0,
  });

  return (
    <div className="relative flex flex-col bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-orange-500">对应APP</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">基金名称</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">基金本金</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前金额</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">实际收益</th>
              {onDelete && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{fundData.map((item: FundDetailWithDates, index: number) => (
            <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.initialFund.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentFund}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-orange-50 border-2 border-orange-200 rounded-md hover:border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-600 font-medium">¥</span>
                </div>
              </td>
              <td className={`px-4 py-2 text-sm text-right font-medium ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{item.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              {onDelete && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onDelete(item)} className="px-2 py-1 text-white bg-orange-600 hover:bg-orange-700 rounded">
                    赎回
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-orange-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-orange-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.initialFund.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.currentFund.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{totals.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            {onDelete && <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>}
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
