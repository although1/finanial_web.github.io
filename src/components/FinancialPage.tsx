import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDInvestmentTable } from './common/USDInvestmentTable';
import { USDInvestmentDetail, USDInvestmentDetailWithDates } from '../data/dataTypes';
import { usdInvestmentData, DEFAULT_DATE } from '../data/usdInvestmentData';
import { AddForm } from './common/AddForm';
import { saveToFile } from '../utils/saveData';
import { isValidDate, SYSTEM_DATE } from '../utils/dateUtils';

// 计算两个日期之间的天数差
const calculateDaysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1.split('/').join('-'));
  const d2 = new Date(date2.split('/').join('-'));
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// 计算年化收益率
const calculateAnnualizedReturn = (profit: number, initialRMB: number, holdingDays: number): number => {
  if (holdingDays <= 0 || initialRMB <= 0) return 0;
  return parseFloat(((10000 / initialRMB * profit / holdingDays * 365)).toFixed(2));
};

const FinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(usdInvestmentData);
  const [isAdding, setIsAdding] = useState(false);
  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<USDInvestmentDetailWithDates[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const dataWithDates = useMemo(() => {
    return data.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialRMB, holdingDays);
      
      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as USDInvestmentDetailWithDates;
    });
  }, [data, currentDate]);

  useEffect(() => {
    if (!hasChanges) {
      setEditedData(dataWithDates);
    }
  }, [dataWithDates, hasChanges]);

  const handleAdd = () => {
    setIsAdding(true);
  };  

  const handleSaveToFile = async (newData: USDInvestmentDetail[]) => {
    setIsSaving(true);
    const success = await saveToFile(newData);
    setIsSaving(false);
    if (!success) {
      alert('保存失败，请稍后重试');
    }
    return success;
  };

  const handleSave = async (newItem: USDInvestmentDetail) => {
    const newData = [...data, newItem];
    const success = await handleSaveToFile(newData);
    if (success) {
      setData(newData);
      setIsAdding(false);
    }
  };

  const handleUpdateItem = (index: number, updates: Partial<USDInvestmentDetailWithDates>) => {
    setEditedData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    if (!hasChanges) return;
    
    const success = await handleSaveToFile(editedData);
    if (success) {
      setData(editedData);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    if (hasChanges) {
      setEditedData(dataWithDates);
      setHasChanges(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    if (!isValidDate(newDate)) {
      alert(`不能选择超过${SYSTEM_DATE}的日期`);
      return;
    }
    setCurrentDate(newDate);
  };

  const handleDelete = async (itemToDelete: USDInvestmentDetailWithDates) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const newData = data.filter(item => 
        !(item.name === itemToDelete.name && item.app === itemToDelete.app)
      );
      const success = await handleSaveToFile(newData);
      if (success) {
        setData(newData);
      }
    }
  };

  const displayData = hasChanges ? editedData : dataWithDates;

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-md border border-blue-600 hover:border-blue-800"
          >
            返回主页
          </button>
          <h1 className="text-2xl font-bold text-gray-800">理财详情</h1>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">当前日期：</label>
            <input
              type="date"
              value={currentDate.split('/').join('-')}
              onChange={(e) => handleDateChange(e.target.value.split('-').join('/'))}
              className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {isSaving && <span className="text-sm text-gray-500">保存中...</span>}
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          新增理财产品
        </button>
      </div>

      <ChartContainer 
        title="美元理财产品详情" 
        description="展示所有美元理财产品的详细信息。"
      >
        {isAdding ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <USDInvestmentTable 
            data={displayData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateItem}
            onSaveAll={hasChanges ? handleSaveAll : undefined}
          />
        )}
      </ChartContainer>
    </div>
  );
};

export default FinancialPage;
