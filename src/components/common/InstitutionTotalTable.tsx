import React from 'react';
import { InstitutionTotalTableRow } from '../../data/dataTypes';

interface InstitutionTotalTableProps {
  data: InstitutionTotalTableRow[];
  showAllDates?: boolean;
}

export const InstitutionTotalTable: React.FC<InstitutionTotalTableProps> = ({ data, showAllDates = false }) => {
  // 根据 showAllDates 过滤数据，如果为 false 只显示每月第一天的数据
  const filteredData = showAllDates 
    ? data 
    : data.filter(item => item.date.endsWith('-01'));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">月份</th>
            <th className="py-2 px-4 border-b text-right">支付宝</th>
            <th className="py-2 px-4 border-b text-right">网商银行</th>
            <th className="py-2 px-4 border-b text-right">工行银行</th>
            <th className="py-2 px-4 border-b text-right">腾讯自选股</th>
            <th className="py-2 px-4 border-b text-right">招商银行</th>
            <th className="py-2 px-4 border-b text-right font-bold">总计</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={row.date} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 border-b">{row.date}</td>
              <td className="py-2 px-4 border-b text-right">
                {row.支付宝.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {row.网商银行.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {row.工行银行.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {row.腾讯自选股.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {row.招商银行.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
              <td className="py-2 px-4 border-b text-right font-bold">
                {row.总计.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
