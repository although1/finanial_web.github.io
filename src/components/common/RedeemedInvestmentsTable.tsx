import React from 'react';
import { RedeemedInvestment } from '../data/redeemedData';

interface RedeemedInvestmentsTableProps {
  data: RedeemedInvestment[];
}

export const RedeemedInvestmentsTable: React.FC<RedeemedInvestmentsTableProps> = ({ data }) => {
  const totals = data.reduce((acc, curr) => ({
    finalProfit: acc.finalProfit + curr.finalProfit,
    finalRMB: acc.finalRMB + curr.finalRMB,
    initialRMB: acc.initialRMB + curr.initialRMB,
  }), {
    finalProfit: 0,
    finalRMB: 0,
    initialRMB: 0,
  });

  return (
    <div className="space-y-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-blue-500">对应APP</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">理财名称</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">美元本金</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">购汇价</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">购汇RMB价格</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">购买时间</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">赎回时间</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">赎回美元数额</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">赎回汇率</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">赎回RMB数额</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">总收益</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">持有天数</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">年化率(%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr 
              key={`${item.app}-${item.name}-${index}`}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-white">{item.app}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ${item.initialUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.buyRate.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-center text-gray-900">{item.purchaseDate}</td>
              <td className="px-4 py-2 text-sm text-center text-gray-900">{item.redeemDate}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ${item.finalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.finalRate.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.finalRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${
                item.finalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ¥{item.finalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">{item.holdingDays}</td>
              <td className={`px-4 py-2 text-sm text-right font-medium ${
                item.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.annualizedReturn.toFixed(2)}
              </td>
            </tr>
          ))}
          {/* 总计行 */}
          <tr className="bg-blue-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-blue-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td colSpan={8} className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${
              totals.finalProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ¥{totals.finalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
            <td colSpan={2} className="px-4 py-2 text-sm text-right text-gray-900">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
