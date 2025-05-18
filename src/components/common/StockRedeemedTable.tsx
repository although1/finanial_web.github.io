import React from 'react';
import { StockRedeemed_I } from '../../data/dataTypes';

interface StockRedeemedInvestmentsTableProps {
  stockData: StockRedeemed_I[];
}

export const StockRedeemedTable_A: React.FC<StockRedeemedInvestmentsTableProps> = ({ stockData }) => {
  // 计算总计数据
  const totals = stockData.reduce((acc, curr) => ({
    initialStock: acc.initialStock + curr.initialStock,
    finalStock: acc.finalStock + curr.finalStock,
    finalProfit: acc.finalProfit + curr.finalProfit,
  }), {
    initialStock: 0,
    finalStock: 0,
    finalProfit: 0,
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-blue-500">对应APP</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">股票名称</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">购买金额</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">赎回日期</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">赎回金额</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">实际收益</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{stockData.map((item, index) => (
          <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-inherit">{item.app}</td>
            <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.initialStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">{item.redeemDate}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.finalStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className={`px-4 py-2 text-sm text-right ${item.finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{item.finalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        ))}
        <tr className="bg-blue-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-blue-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.initialStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.finalStock.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${totals.finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{totals.finalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};