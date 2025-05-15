import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDInvestmentTable } from './common/USDInvestmentTable';
import { RedeemedInvestmentsTable } from './common/RedeemedInvestmentsTable';
import { RMBInvestmentTable } from './common/RMBInvestmentTable';
import { RedeemedRMBInvestmentsTable } from './common/RedeemedRMBInvestmentsTable';
import { 
  USDInvestmentDetail, 
  USDInvestmentDetailWithDates, 
  RedeemedInvestment,
  RMBInvestmentDetail,
  RMBInvestmentDetailWithDates,
  RedeemedRMBInvestment
} from '../data/dataTypes';
import { usdInvestmentData, DEFAULT_DATE } from '../data/usdInvestmentData';
import { redeemedInvestmentData } from '../data/redeemedInvestments';
import { redeemedRmbInvestmentData } from '../data/redeemedRmbInvestments';
import { rmbInvestmentData } from '../data/rmbInvestmentData';
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
  const [rmbData, setRmbData] = useState(rmbInvestmentData);
  const [redeemedData, setRedeemedData] = useState<RedeemedInvestment[]>([]);
  const [redeemedRmbData, setRedeemedRmbData] = useState<RedeemedRMBInvestment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingRmb, setIsAddingRmb] = useState(false);
  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<USDInvestmentDetailWithDates[]>([]);
  const [editedRmbData, setEditedRmbData] = useState<RMBInvestmentDetailWithDates[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasRmbChanges, setHasRmbChanges] = useState(false);  // 初始化数据
  useEffect(() => {
    setData(usdInvestmentData);
    setRmbData(rmbInvestmentData);
    setRedeemedData(redeemedInvestmentData);
    setRedeemedRmbData(redeemedRmbInvestmentData);
  }, []);

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

  const rmbDataWithDates = useMemo(() => {
    return rmbData.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialRMB, holdingDays);
      
      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as RMBInvestmentDetailWithDates;
    });
  }, [rmbData, currentDate]);

  useEffect(() => {
    if (!hasChanges) {
      setEditedData(dataWithDates);
    }
    if (!hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
    }
  }, [dataWithDates, hasChanges, rmbDataWithDates, hasRmbChanges]);

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddRmb = () => {
    setIsAddingRmb(true);
  };

  const handleSaveToFile = async (
    newData: USDInvestmentDetail[], 
    newRmbData?: RMBInvestmentDetail[],
    newRedeemedData?: RedeemedInvestment[], 
    newRedeemedRmbData?: RedeemedRMBInvestment[]
  ) => {
    setIsSaving(true);
    const success = await saveToFile(
      newData, 
      newRedeemedData || redeemedData, 
      newRmbData || rmbData,
      newRedeemedRmbData || redeemedRmbData
    );
    setIsSaving(false);
    if (!success) {
      alert('保存失败，请稍后重试');
    }
    return success;
  };

  const handleSave = async (newItem: USDInvestmentDetail | RMBInvestmentDetail) => {
    if ('initialUSD' in newItem) {
      // USD investment
      const newData = [...data, newItem as USDInvestmentDetail];
      const success = await handleSaveToFile(newData);
      if (success) {
        setData(newData);
        setIsAdding(false);
      }
    } else {
      // RMB investment
      const newData = [...rmbData, newItem as RMBInvestmentDetail];
      const success = await handleSaveToFile(data, newData);
      if (success) {
        setRmbData(newData);
        setIsAddingRmb(false);
      }
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

  const handleUpdateRmbItem = (index: number, updates: Partial<RMBInvestmentDetailWithDates>) => {
    setEditedRmbData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
    setHasRmbChanges(true);
  };

  const handleSaveAll = async () => {
    if (!hasChanges && !hasRmbChanges) return;
    
    const success = await handleSaveToFile(
      hasChanges ? editedData : data,
      hasRmbChanges ? editedRmbData : rmbData
    );
    if (success) {
      if (hasChanges) {
        setData(editedData);
        setHasChanges(false);
      }
      if (hasRmbChanges) {
        setRmbData(editedRmbData);
        setHasRmbChanges(false);
      }
    }
  };

  const handleDelete = async (item: USDInvestmentDetailWithDates | RMBInvestmentDetailWithDates) => {
    if (window.confirm('确定要赎回该产品？赎回后将保存到历史记录中。')) {
      if ('initialUSD' in item) {
        // USD investment
        const usdItem = item as USDInvestmentDetailWithDates;
        const redeemedItem: RedeemedInvestment = {
          ...usdItem,
          redeemDate: currentDate,
          finalUSD: usdItem.currentUSD,
          finalRate: usdItem.currentRate,
          finalRMB: usdItem.currentRMB,
          finalProfit: usdItem.profit
        };

        const newRedeemedData = [...redeemedData, redeemedItem];
        const newData = data.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(newData, undefined, newRedeemedData);
        if (success) {
          setRedeemedData(newRedeemedData);
          setData(newData);
        }
      } else {
        // RMB investment
        const rmbItem = item as RMBInvestmentDetailWithDates;
        const redeemedItem: RedeemedRMBInvestment = {
          ...rmbItem,
          redeemDate: currentDate,
          finalRMB: rmbItem.currentRMB,
          finalProfit: rmbItem.profit
        };

        const newRedeemedRmbData = [...redeemedRmbData, redeemedItem];
        const newData = rmbData.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(data, newData, undefined, newRedeemedRmbData);
        if (success) {
          setRedeemedRmbData(newRedeemedRmbData);
          setRmbData(newData);
        }
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsAddingRmb(false);
    if (hasChanges) {
      setEditedData(dataWithDates);
      setHasChanges(false);
    }
    if (hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
      setHasRmbChanges(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    if (!isValidDate(newDate)) {
      alert(`不能选择超过${SYSTEM_DATE}的日期`);
      return;
    }
    setCurrentDate(newDate);
  };

  const displayData = hasChanges ? editedData : dataWithDates;
  const displayRmbData = hasRmbChanges ? editedRmbData : rmbDataWithDates;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-md border border-blue-600 hover:border-blue-800"
          >
            返回主页
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            新增美元理财产品
          </button>
          <button
            onClick={handleAddRmb}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            新增人民币理财产品
          </button>
        </div>
        <input
          type="date"
          value={currentDate.split('/').join('-')}
          onChange={(e) => handleDateChange(e.target.value.split('-').join('/'))}
          className="px-4 py-2 text-sm border rounded-md"
        />
      </div>

      <ChartContainer 
        title="美元理财产品详情" 
        description="展示所有美元理财产品的详细信息。"
        useFixedHeight={false}
      >
        {isAdding ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="usd"
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

      <ChartContainer 
        title="人民币理财产品详情" 
        description="展示所有人民币理财产品的详细信息。"
        useFixedHeight={false}
      >
        {isAddingRmb ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="rmb"
          />
        ) : (
          <RMBInvestmentTable 
            data={displayRmbData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateRmbItem}
            onSaveAll={hasRmbChanges ? handleSaveAll : undefined}
          />
        )}
      </ChartContainer>

      {redeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回美元产品记录" 
          description="展示所有已赎回美元产品的最终收益情况。"
          useFixedHeight={false}
        >
          <RedeemedInvestmentsTable data={redeemedData} />
        </ChartContainer>
      )}      {redeemedRmbData.length > 0 && (
        <ChartContainer 
          title="已赎回人民币产品记录" 
          description="展示所有已赎回人民币产品的最终收益情况。"
          useFixedHeight={false}
        >
          <RedeemedRMBInvestmentsTable data={redeemedRmbData} />
        </ChartContainer>
      )}
    </div>
  );
};

export default FinancialPage;
