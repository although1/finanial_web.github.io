import React from 'react';
import { USDInvestmentDetailWithDates } from '../../data/dataTypes'; 
interface USDInvestmentTableProps {
  data: USDInvestmentDetailWithDates[];
  onDelete?: (item: USDInvestmentDetailWithDates) => void;
  onUpdateItem?: (index: number, updates: Partial<USDInvestmentDetailWithDates>) => void;
  onSaveAll?: () => void;
}

export const USDInvestmentTable: React.FC<USDInvestmentTableProps> = ({ 
  data, 
  onDelete,
  onUpdateItem,
  onSaveAll
}) => {
  const calculateNewAnnualizedReturn = (profit: number, initialRMB: number, holdingDays: number): number => {
    if (holdingDays <= 0 || initialRMB <= 0) return 0;
    return parseFloat(((10000 / initialRMB * profit / holdingDays * 365)).toFixed(2));
  };

  const handleValueChange = (index: number, field: keyof USDInvestmentDetailWithDates, value: string) => {
    if (!onUpdateItem) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const item = data[index];

    // 如果修改了当前美元数额，只更新当前项
    if (field === 'currentUSD') {
      const currentRMB = parseFloat((numValue * item.currentRate / 100).toFixed(2));
      const profit = parseFloat((currentRMB - item.initialRMB).toFixed(2));
      onUpdateItem(index, {
        currentUSD: numValue,
        currentRMB: currentRMB,
        profit: profit,
        annualizedReturn: calculateNewAnnualizedReturn(profit, item.initialRMB, item.holdingDays)
      });
    }
    // 如果修改了结汇价，更新同一个app的所有产品
    else if (field === 'currentRate') {
      // 找出所有同app的产品索引
      const sameAppIndexes = data.reduce((indexes: number[], curr, currIndex) => {
        if (curr.app === item.app) {
          indexes.push(currIndex);
        }
        return indexes;
      }, []);

      // 更新所有同app产品的结汇价和相关计算
      sameAppIndexes.forEach(idx => {
        const currentItem = data[idx];
        const currentRMB = parseFloat((currentItem.currentUSD * numValue / 100).toFixed(2));
        const profit = parseFloat((currentRMB - currentItem.initialRMB).toFixed(2));
        onUpdateItem(idx, {
          currentRate: numValue,
          currentRMB: currentRMB,
          profit: profit,
          annualizedReturn: calculateNewAnnualizedReturn(profit, currentItem.initialRMB, currentItem.holdingDays)
        });
      });
    }
  };
  // 计算总计数据
  const totals = data.reduce((acc, curr) => ({
    initialUSD: acc.initialUSD + curr.initialUSD,
    initialRMB: acc.initialRMB + curr.initialRMB,
    currentUSD: acc.currentUSD + curr.currentUSD,
    currentRMB: acc.currentRMB + curr.currentRMB,
    profit: acc.profit + curr.profit,
  }), {
    initialUSD: 0,
    initialRMB: 0,
    currentUSD: 0,
    currentRMB: 0,
    profit: 0,
  });

  // 计算总体年化收益率
  const totalAnnualizedReturn = data.length > 0 ? 
    (totals.profit / totals.initialRMB * 365 / data[0].holdingDays * 100) : 0;  return (
    <div className="relative flex flex-col bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-blue-500">对应APP</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">理财名称</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">美元本金</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">购汇价</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">购汇RMB价格</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">购买时间</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前美元数额</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">结汇价</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">当前RMB数额</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">实际收益</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">持有天数</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">年化率(%)</th>
              {onDelete && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{data.map((item: USDInvestmentDetailWithDates, index: number) => (
            <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">${item.initialUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.buyRate.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-center text-gray-900">{item.purchaseDate}</td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentUSD}
                    onChange={(e) => handleValueChange(index, 'currentUSD', e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-blue-50 border-2 border-blue-200 rounded-md hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-medium">$</span>
                </div>
              </td>
              <td className="px-4 py-2 text-base text-right text-gray-900">
                <div className="relative group">
                  <input
                    type="number"
                    value={item.currentRate}
                    onChange={(e) => handleValueChange(index, 'currentRate', e.target.value)}
                    className="w-32 py-1 text-lg font-medium text-right bg-blue-50 border-2 border-blue-200 rounded-md hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                    step="0.01"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 font-medium">¥</span>
                </div>
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.currentRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className={`px-4 py-2 text-sm text-right ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>¥{item.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">{item.holdingDays}</td>
              <td className={`px-4 py-2 text-sm text-right font-medium ${item.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>{item.annualizedReturn.toFixed(2)}</td>
              {onDelete && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onDelete(item)} className="px-2 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded">赎回</button>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-blue-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-blue-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">${totals.initialUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">${totals.currentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
            >
              保存修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
