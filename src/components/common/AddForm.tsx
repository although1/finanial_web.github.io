import React, { useState } from 'react';
import { USDDetail, RMBDetail, DepositDetail, FundDetail, PensionDetail, StockDetail } from '../../data/dataTypes';
import { isValidDate, SYSTEM_DATE } from '../../utils/dateUtils';

interface AddFormProps {
  currentDate: string;
  onSave: (item: USDDetail | RMBDetail | DepositDetail | FundDetail | PensionDetail | StockDetail) => void;
  onCancel: () => void;
  type?: 'usd' | 'rmb' | 'deposit' | 'fund' | 'pension' | 'stock';
}

const appOptions = ["工商银行", "招商银行", "网商银行", "腾讯自选股", "支付宝"];

export const AddForm: React.FC<AddFormProps> = ({ currentDate, onSave, onCancel, type = 'usd' }) => {
  const [formData, setFormData] = useState(() => {
    switch (type) {
      case 'usd':
        return {
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
        };
      case 'rmb':
        return {
          app: appOptions[0],
          name: '',
          initialRMB: 0,
          purchaseDate: currentDate,
          currentRMB: 0,
          profit: 0,
        };
      case 'deposit':
      case 'pension':
        return {
          app: appOptions[0],
          name: '',
          currentRMB: 0,
        };
      case 'fund':
        return {
          app: appOptions[0],
          name: '',
          initialFund: 0,
          currentFund: 0,
          profit: 0,
        };
      case 'stock':
        return {
          app: appOptions[0],
          name: '',
          initialStock: 0,
          currentStock: 0,
          profit: 0,
        };
      default:
        return {};
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!name) return;

    // 验证日期
    if (name === 'purchaseDate' && (type === 'usd' || type === 'rmb')) {
      const formattedDate = value.split('-').join('/');
      if (!isValidDate(formattedDate)) {
        alert(`不能选择超过${SYSTEM_DATE}的日期`);
        return;
      }
    }

    let numValue: string | number = value;
    const isNumericField = ['USD', 'Rate', 'RMB', 'Fund', 'Stock'].some(field => name.includes(field));
    if (isNumericField) {
      numValue = parseFloat(value) || 0;
    }

    setFormData(prev => {
      const updates: any = { [name]: numValue };

      switch (type) {
        case 'usd':
          if (name === 'initialUSD' || name === 'buyRate') {
            const initialUSD = name === 'initialUSD' ? (numValue as number) : (prev as USDDetail).initialUSD;
            const buyRate = name === 'buyRate' ? (numValue as number) : (prev as USDDetail).buyRate;
            updates.initialRMB = parseFloat((initialUSD * buyRate / 100).toFixed(2));
            updates.currentUSD = initialUSD;
            updates.currentRate = buyRate;
            updates.currentRMB = updates.initialRMB;
            updates.profit = 0;
          }
          break;

        case 'rmb':
          if (name === 'initialRMB') {
            updates.currentRMB = numValue;
            updates.profit = 0;
          }
          break;

        case 'fund':
          if (name === 'initialFund') {
            updates.currentFund = numValue;
            updates.profit = 0;
          } else if (name === 'currentFund') {
            const currentValue = numValue as number;
            const initialValue = (prev as FundDetail).initialFund;
            updates.profit = parseFloat((currentValue - initialValue).toFixed(2));
          }
          break;

        case 'stock':
          if (name === 'initialStock') {
            updates.currentStock = numValue;
            updates.profit = 0;
          } else if (name === 'currentStock') {
            const currentValue = numValue as number;
            const initialValue = (prev as StockDetail).initialStock;
            updates.profit = parseFloat((currentValue - initialValue).toFixed(2));
          }
          break;
      }

      return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app || !formData.name) {
      alert('请填写所有必填字段');
      return;
    }
    onSave(formData as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">对应APP</label>
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

        {type === 'usd' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">美元本金</label>
              <input
                type="number"
                name="initialUSD"
                value={(formData as USDDetail).initialUSD || ''}
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
                value={(formData as USDDetail).buyRate || ''}
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
                value={(formData as USDDetail).initialRMB}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </>
        )}

        {(type === 'rmb' || type === 'deposit' || type === 'pension') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'rmb' ? '人民币本金' : '金额'}
            </label>
            <input
              type="number"
              name={type === 'rmb' ? 'initialRMB' : 'currentRMB'}
              value={type === 'rmb' ? (formData as RMBDetail).initialRMB : (formData as DepositDetail).currentRMB}
              onChange={handleChange}
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {type === 'fund' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">初始基金金额</label>
              <input
                type="number"
                name="initialFund"
                value={(formData as FundDetail).initialFund}
                onChange={handleChange}
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前市值</label>
              <input
                type="number"
                name="currentFund"
                value={(formData as FundDetail).currentFund}
                onChange={handleChange}
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {type === 'stock' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">初始股票金额</label>
              <input
                type="number"
                name="initialStock"
                value={(formData as StockDetail).initialStock}
                onChange={handleChange}
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前市值</label>
              <input
                type="number"
                name="currentStock"
                value={(formData as StockDetail).currentStock}
                onChange={handleChange}
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {(type === 'usd' || type === 'rmb') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">购买日期</label>
            <input
              type="date"
              name="purchaseDate"
              value={(formData as USDDetail | RMBDetail).purchaseDate.split('/').join('-')}
              onChange={(e) => handleChange({
                ...e,
                target: { ...e.target, name: 'purchaseDate',value: e.target.value.split('-').join('/') }
              })}
	      required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
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
