import React from 'react';
import { USDInvestmentDetailWithDates } from '../../data/dataTypes';

interface USDInvestmentTableProps {
  data: USDInvestmentDetailWithDates[];
  onEdit?: (item: USDInvestmentDetailWithDates) => void;
  onDelete?: (item: USDInvestmentDetailWithDates) => void;
}

export const USDInvestmentTable: React.FC<USDInvestmentTableProps> = ({ data, onEdit, onDelete }) => {
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
    (totals.profit / totals.initialRMB * 365 / data[0].holdingDays * 100) : 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
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
            {(onEdit || onDelete) && <th className="px-4 py-2 text-right text-sm font-semibold">操作</th>}
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
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ${item.currentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.currentRate.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">
                ¥{item.currentRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className={`px-4 py-2 text-sm text-right ${
                item.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ¥{item.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-2 text-sm text-right text-gray-900">{item.holdingDays}</td>
              <td className={`px-4 py-2 text-sm text-right font-medium ${
                item.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.annualizedReturn.toFixed(2)}
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      编辑
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {/* 添加总计行 */}
          <tr className="bg-blue-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-blue-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">
              ${totals.initialUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">
              ¥{totals.initialRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">
              ${totals.currentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">
              ¥{totals.currentRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${
              totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ¥{totals.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>
            <td className={`px-4 py-2 text-sm text-right font-medium ${
              totalAnnualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalAnnualizedReturn.toFixed(2)}
            </td>
            {(onEdit || onDelete) && <td className="px-4 py-2 text-sm text-right text-gray-900">-</td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
