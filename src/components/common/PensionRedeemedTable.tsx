import React from 'react';
import { PensionRedeemed } from '../../data/dataTypes';

interface RedeemedPensionsTableProps {
  pensionData: PensionRedeemed[];
}

export const PensionRedeemedTable: React.FC<RedeemedPensionsTableProps> = ({ pensionData }) => {
  // 计算总计数据
  const totals = pensionData.reduce((acc, curr) => ({
    finalRMB: acc.finalRMB + curr.finalRMB,
  }), {
    finalRMB: 0,
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold sticky left-0 bg-green-500">对应APP</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">养老金名称</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">赎回日期</th>
            <th className="px-4 py-2 text-right text-sm font-semibold">赎回金额</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{pensionData.map((item, index) => (
          <tr key={`${item.app}-${item.name}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-inherit">{item.app}</td>
            <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">{item.redeemDate}</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{item.finalRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
          </tr>
        ))}
        <tr className="bg-green-50 font-semibold">
            <td className="px-4 py-2 text-sm text-gray-900 sticky left-0 bg-green-50">总计</td>
            <td className="px-4 py-2 text-sm text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-center text-gray-900">-</td>
            <td className="px-4 py-2 text-sm text-right text-gray-900">¥{totals.finalRMB.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
