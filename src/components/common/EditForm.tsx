import React, { useState } from 'react';
import { USDInvestmentDetailWithDates } from '../../data/dataTypes';

interface EditFormProps {
  item: USDInvestmentDetailWithDates;
  onSave: (item: USDInvestmentDetailWithDates) => void;
  onCancel: () => void;
}

// 计算年化收益率
const calculateAnnualizedReturn = (profit: number, initialRMB: number, holdingDays: number): number => {
  if (holdingDays <= 0 || initialRMB <= 0) return 0;
  return parseFloat((10000 / initialRMB * profit / holdingDays * 365).toFixed(2));
};

export const EditForm: React.FC<EditFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name.includes('USD') || name.includes('RMB') || name.includes('Rate')
      ? parseFloat(value)
      : value;

    setFormData(prev => {
      const updates: Partial<USDInvestmentDetailWithDates> = { [name]: numValue };
      
      // 如果修改的是当前美元数额或结汇价，自动计算当前RMB数额
      if (name === 'currentUSD' || name === 'currentRate') {
        const currentUSD = name === 'currentUSD' ? (numValue as number) : prev.currentUSD;
        const currentRate = name === 'currentRate' ? (numValue as number) : prev.currentRate;
        
        // 计算当前RMB数额
        const currentRMB = parseFloat((currentUSD * currentRate/100).toFixed(2));
        updates.currentRMB = currentRMB;
        
        // 计算实际收益
        const profit = parseFloat((currentRMB - prev.initialRMB).toFixed(2));
        updates.profit = profit;

        // 计算年化收益率
        const annualizedReturn = calculateAnnualizedReturn(profit, prev.initialRMB, prev.holdingDays);
        updates.annualizedReturn = annualizedReturn;
      }

      return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">机构名称</label>
          <input
            type="text"
            name="app"
            value={formData.app}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">美元本金</label>
          <input
            type="number"
            name="initialUSD"
            value={formData.initialUSD}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">购汇价</label>
          <input
            type="number"
            name="buyRate"
            value={formData.buyRate}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">购汇RMB价格</label>
          <input
            type="number"
            name="initialRMB"
            value={formData.initialRMB}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">购买时间</label>
          <input
            type="text"
            name="purchaseDate"
            value={formData.purchaseDate}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">当前美元数额</label>
          <input
            type="number"
            name="currentUSD"
            value={formData.currentUSD}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">结汇价</label>
          <input
            type="number"
            name="currentRate"
            value={formData.currentRate}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">当前RMB数额 (自动计算)</label>
          <input
            type="number"
            name="currentRMB"
            value={formData.currentRMB}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">实际收益 (自动计算)</label>
          <input
            type="number"
            name="profit"
            value={formData.profit}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">持有天数 (自动计算)</label>
          <input
            type="number"
            name="holdingDays"
            value={formData.holdingDays}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年化收益率 (自动计算)</label>
          <input
            type="number"
            name="annualizedReturn"
            value={formData.annualizedReturn}
            readOnly
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          保存
        </button>
      </div>
    </form>
  );
};