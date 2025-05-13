import React, { useState } from 'react';
import { USDInvestmentDetail } from '../../data/dataTypes';

interface EditFormProps {
  item: USDInvestmentDetail;
  onSave: (item: USDInvestmentDetail) => void;
  onCancel: () => void;
}

export const EditForm: React.FC<EditFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('USD') || name.includes('RMB') || name.includes('Rate') || name.includes('Return')
        ? parseFloat(value)
        : value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    // 将 YYYY-MM-DD 格式转换为 YYYY/MM/DD 格式
    const formattedDate = date.split('-').join('/');
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
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
          <label className="block text-sm font-medium text-gray-700 mb-1">当前RMB数额</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">实际收益</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
          <input
            type="date"
            name="date"
            value={formData.date.split('/').join('-')}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">持有天数</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">年化收益率</label>
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