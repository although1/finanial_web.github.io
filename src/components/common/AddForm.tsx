import React, { useState } from 'react';
import { USDInvestmentDetail } from '../../data/dataTypes';
import { isValidDate, SYSTEM_DATE } from '../../utils/dateUtils';

interface AddFormProps {
  currentDate: string;
  onSave: (item: USDInvestmentDetail) => void;
  onCancel: () => void;
}

const appOptions = ["工商银行", "招商银行", "网商银行", "腾讯自选股", "支付宝"];

export const AddForm: React.FC<AddFormProps> = ({ currentDate, onSave, onCancel }) => {
  const [formData, setFormData] = useState<USDInvestmentDetail>({
    app: appOptions[0],
    name: '',
    initialUSD: 0,
    buyRate: 0,
    initialRMB: 0,
    purchaseDate: currentDate,
    currentUSD: 0,
    currentRate: 0,
    currentRMB: 0,
    profit: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 验证日期
    if (name === 'purchaseDate') {
      if (!isValidDate(value)) {
        alert(`不能选择超过${SYSTEM_DATE}的日期`);
        return;
      }
    }
    
    let numValue: string | number = value;
    
    if (name.includes('USD') || name.includes('Rate')) {
      numValue = parseFloat(value) || 0;
    }

    setFormData(prev => {
      const updates: Partial<USDInvestmentDetail> = { [name]: numValue };
      
      // 自动计算相关字段
      if (name === 'initialUSD' || name === 'buyRate') {
        const initialUSD = name === 'initialUSD' ? (numValue as number) : prev.initialUSD;
        const buyRate = name === 'buyRate' ? (numValue as number) : prev.buyRate;
        
        // 计算购汇RMB价格
        const initialRMB = parseFloat((initialUSD * buyRate / 100).toFixed(2));
        updates.initialRMB = initialRMB;
        
        // 设置当前值等于初始值
        updates.currentUSD = initialUSD;
        updates.currentRate = buyRate;
        updates.currentRMB = initialRMB;
        updates.profit = 0;
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
          <select
            name="app"
            value={formData.app}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {appOptions.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">美元本金</label>
          <input
            type="number"
            name="initialUSD"
            value={formData.initialUSD || ''}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">购汇价</label>
          <input
            type="number"
            name="buyRate"
            value={formData.buyRate || ''}
            onChange={handleChange}
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">购汇RMB价格 (自动计算)</label>
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
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate.split('/').join('-')}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'purchaseDate',
                value: e.target.value.split('-').join('/')
              }
            })}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
