import React from 'react';
import { StockDetailWithDates } from '../../data/dataTypes';

interface StockInvestmentTableProps {
  stockData: StockDetailWithDates[];
  onDelete?: (item: StockDetailWithDates) => void;
  onUpdateItem?: (index: number, updates: Partial<StockDetailWithDates>) => void;
}

export const StockTable_A: React.FC<StockInvestmentTableProps> = ({
  stockData,
  onDelete,
  onUpdateItem
}) => {
  const handleValueChange = (index: number, value: string) => {
    if (!onUpdateItem) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const item = stockData[index];

    const currentStock = numValue;
    const profit = parseFloat((currentStock - item.initialStock).toFixed(2));
    onUpdateItem(index, {
      currentStock,
      profit
    });
  };

  // 计算总计数据
  const totals = stockData.reduce((acc, curr) => ({
    initialStock: acc.initialStock + curr.initialStock,
    currentStock: acc.currentStock + curr.currentStock,
    profit: acc.profit + curr.profit,
  }), {
    initialStock: 0,
    currentStock: 0,
    profit: 0,
  });

  return (
    <div className="relative flex flex-col bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-pink-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-pink-500">对应APP</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">股票名称</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">股票本金</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前金额</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">实际收益</th>
              {onDelete && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{stockData.map((item: StockDetailWithDates, index: number) => (
            <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.initialStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentStock}
                    onChange={(e) => handleValueChange(index, 'currentStock', e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-pink-50 border-2 border-pink-200 rounded-md hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-600 font-medium">¥</span>
                </div>
              </td>
              <td className={`px-4 py-2 text-sm text-right ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{item.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              {onDelete && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onDelete(item)} className="px-2 py-1 text-white bg-pink-600 hover:bg-pink-700 rounded">
                    赎回
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-pink-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-pink-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.initialStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.currentStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{totals.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            {onDelete && <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  );
};