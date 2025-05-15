import React from 'react';
import { DepositDetailWithDates } from '../../data/dataTypes';

interface DepositTableProps {
  data: DepositDetailWithDates[];
  onDelete?: (item: DepositDetailWithDates) => void;
  onUpdateItem?: (index: number, updates: Partial<DepositDetailWithDates>) => void;
  onSaveAll?: () => void;
}

export const DepositTable: React.FC<DepositTableProps> = ({
  data,
  onDelete,
  onUpdateItem,
  onSaveAll
}) => {
  const handleValueChange = (index: number, field: keyof DepositDetailWithDates, value: string) => {
    if (!onUpdateItem) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const item = data[index];
    const currentRMB = numValue;
    const profit = parseFloat((currentRMB - item.initialRMB).toFixed(2));
    const annualizedReturn = parseFloat((profit / item.initialRMB / item.holdingDays * 365 * 100).toFixed(2));
    
    onUpdateItem(index, {
      currentRMB,
      profit,
      annualizedReturn
    });
  };

  // 计算总计数据
  const totals = data.reduce((acc, curr) => ({
    initialRMB: acc.initialRMB + curr.initialRMB,
    currentRMB: acc.currentRMB + curr.currentRMB,
    profit: acc.profit + curr.profit,
  }), {
    initialRMB: 0,
    currentRMB: 0,
    profit: 0,
  });

  // 计算总体年化收益率
  const totalAnnualizedReturn = data.length > 0 ?
    parseFloat((totals.profit / totals.initialRMB * 365 / data[0].holdingDays * 100).toFixed(2)) : 0;

  return (
    <div className="relative flex flex-col bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-green-500">对应APP</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">存款名称</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">初始金额</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">开始日期</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前金额</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">收益</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">持有天数</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">年化率(%)</th>
              {onDelete && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{data.map((item, index) => (
            <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-center text-gray-900">{item.purchaseDate}</td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentRMB}
                    onChange={(e) => handleValueChange(index, 'currentRMB', e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-blue-50 border-2 border-blue-200 rounded-md hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-medium">¥</span>
                </div>
              </td>
              <td className={`px-4 py-2 text-sm text-right ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{item.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">{item.holdingDays}</td>
              <td className={`px-4 py-2 text-sm text-right font-medium ${item.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>{item.annualizedReturn.toFixed(2)}</td>
              {onDelete && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onDelete(item)} className="px-2 py-1 text-white bg-green-600 hover:bg-green-700 rounded">
                    赎回
                  </button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-green-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-green-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.currentRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{totals.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${totalAnnualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>{totalAnnualizedReturn.toFixed(2)}</td>
            {onDelete && <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>}
          </tr>
          </tbody>
        </table>
      </div>
      {onSaveAll && (
        <div className="sticky bottom-0 right-0 px-4 py-3 bg-white border-t">
          <div className="flex justify-end">
            <button
              onClick={onSaveAll}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm"
            >
              保存修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
