import React from 'react';
import { PensionDetailWithDates } from '../../data/dataTypes';

interface PensionTableProps {
  pensionData: PensionDetailWithDates[];
  onDelete?: (item: PensionDetailWithDates) => void;
  onUpdateItem?: (index: number, updates: Partial<PensionDetailWithDates>) => void;
}

export const PensionTable: React.FC<PensionTableProps> = ({
  pensionData,
  onDelete,
  onUpdateItem
}) => {
  const handleValueChange = (index: number, value: string) => {
    if (!onUpdateItem) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    const currentRMB = numValue;
    
    onUpdateItem(index, {
      currentRMB,
    });
  };

  // 计算总计数据
  const totals = pensionData.reduce((acc, curr) => ({
    currentRMB: acc.currentRMB + curr.currentRMB,
  }), {
    currentRMB: 0,
  });

  return (
    <div className="relative flex flex-col bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-green-500">对应APP</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">养老金名称</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前金额</th>
              {onDelete && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{pensionData.map((item, index) => (
            <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentRMB}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-blue-50 border-2 border-blue-200 rounded-md hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-medium">¥</span>
                </div>
              </td>
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
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.currentRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            {onDelete && <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>}
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
