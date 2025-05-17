import React, { useState } from 'react';
import { USDInvestmentDetail, RMBInvestmentDetail, DepositDetail,FundInvestmentDetail,PensionDetail } from '../../data/dataTypes';
import { isValidDate, SYSTEM_DATE } from '../../utils/dateUtils';

interface AddFormProps {
  currentDate: string;
  onSave: (item: USDInvestmentDetail | RMBInvestmentDetail | DepositDetail | FundInvestmentDetail | PensionDetail) => void;
  onCancel: () => void;
  type?: 'usd' | 'rmb' | 'deposit' | 'fund' | 'pension';
}

const appOptions = ["工商银行", "招商银行", "网商银行", "腾讯自选股", "支付宝"];
const defaultUSDForm: USDInvestmentDetail = {
  app: appOptions[0],
  name: '',
  initialUSD: 0,
  buyRate: 0,
  initialRMB: 0,
  purchaseDate: '',
  currentUSD: 0,
  currentRate: 0,
  currentRMB: 0,
  profit: 0,
};

const defaultRMBForm: RMBInvestmentDetail = {
  app: appOptions[0],
  name: '',
  initialRMB: 0,
  purchaseDate: '',
  currentRMB: 0,
  profit: 0,
};

const defaultDepositForm: DepositDetail = {
  app: appOptions[0],
  name: '',
  currentRMB: 0
};

const defaultPensionForm: PensionDetail = {
  app: appOptions[0],
  name: '',
  currentRMB: 0
};

const defaultFundForm: FundInvestmentDetail = {
  app: appOptions[0],
  name: '',
  initialFund: 0,
  purchaseDate: '',
  currentFund: 0,
  profit: 0
}

export const AddForm: React.FC<AddFormProps> = ({ currentDate, onSave, onCancel, type = 'usd' }) => {
  const [formData, setFormData] = useState<USDInvestmentDetail | RMBInvestmentDetail | DepositDetail | FundInvestmentDetail | PensionDetail>(
    type === 'usd' 
      ? { ...defaultUSDForm, purchaseDate: currentDate }
      : type === 'rmb'
      ? { ...defaultRMBForm, purchaseDate: currentDate }
      : type === 'deposit'
      ? { ...defaultDepositForm }
      : type === 'pension'
      ? { ...defaultPensionForm }
      : { ...defaultFundForm, purchaseDate: currentDate }
  );

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
    
    if (name.includes('USD') || name.includes('Rate') || name.includes('RMB') || name.includes('Fund')) {
      numValue = parseFloat(value) || 0;
    }

    if (type === 'deposit' || type === 'pension') {
      setFormData(prev => {
        const prevData = prev as DepositDetail | PensionDetail;
        return { ...prevData, [name]: numValue };
      });
    } else if (type === 'usd') {
      setFormData(prev => {
        const prevUSD = prev as USDInvestmentDetail;
        const updates: Partial<USDInvestmentDetail> = { [name]: numValue };
        
        // USD investment calculations
        if (name === 'initialUSD' || name === 'buyRate') {
          const initialUSD = name === 'initialUSD' ? (numValue as number) : prevUSD.initialUSD;
          const buyRate = name === 'buyRate' ? (numValue as number) : prevUSD.buyRate;
          
          updates.initialRMB = parseFloat((initialUSD * buyRate/100).toFixed(2));
          updates.currentUSD = initialUSD;
          updates.currentRate = buyRate;
          updates.currentRMB = updates.initialRMB;
          updates.profit = 0;
        }
        
        if (name === 'currentUSD' || name === 'currentRate') {
          const currentUSD = name === 'currentUSD' ? (numValue as number) : prevUSD.currentUSD;
          const currentRate = name === 'currentRate' ? (numValue as number) : prevUSD.currentRate;
          
          updates.currentRMB = parseFloat((currentUSD * currentRate).toFixed(2));
          updates.profit = parseFloat((updates.currentRMB - prevUSD.initialRMB).toFixed(2));
        }
        
        return { ...prevUSD, ...updates };
      });
    } else {
      setFormData(prev => {
        const prevRMB = prev as RMBInvestmentDetail;
        const updates: Partial<RMBInvestmentDetail> = { [name]: numValue };
        
        // RMB investment calculations
        if (name === 'initialRMB') {
          updates.currentRMB = numValue as number;
          updates.profit = 0;
        }
        
        if (name === 'currentRMB') {
          updates.profit = parseFloat(((numValue as number) - prevRMB.initialRMB).toFixed(2));
        }
        
        return { ...prevRMB, ...updates };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app || !formData.name || (type !== 'deposit' && !(formData as USDInvestmentDetail | RMBInvestmentDetail | FundInvestmentDetail).purchaseDate)) {
      alert('请填写所有必填字段');
      return;
    }
    onSave(formData);
  };

  const isUSDForm = type === 'usd';
  const usdForm = isUSDForm ? formData as USDInvestmentDetail : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">对应APP</label>
          <select
            name="app"
            value={formData.app}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            {appOptions.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">产品名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        {isUSDForm && usdForm ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">初始美元金额</label>
              <input
                type="number"
                name="initialUSD"
                value={usdForm.initialUSD}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">购汇汇率</label>
              <input
                type="number"
                name="buyRate"
                value={usdForm.buyRate}
                onChange={handleChange}
                step="0.0001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">初始人民币金额</label>
            <input
              type="number"
              name="initialRMB"
              value={type === 'deposit' ? (formData as DepositDetail).currentRMB : (formData as RMBInvestmentDetail).initialRMB}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">购买日期</label>
          <input
            type="date"
            name="purchaseDate"
            value={type !== 'deposit' ? (formData as USDInvestmentDetail | RMBInvestmentDetail | FundInvestmentDetail).purchaseDate.split('/').join('-') : ''}
            onChange={(e) => handleChange({
              ...e,
              target: { ...e.target, value: e.target.value.split('-').join('/') }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          保存
        </button>
      </div>
    </form>
  );
};
