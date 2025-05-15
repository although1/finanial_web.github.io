import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDInvestmentTable } from './common/USDInvestmentTable';
import { USDRedeemedInvestmentsTable } from './common/USDRedeemedInvestmentsTable';
import { RMBInvestmentTable } from './common/RMBInvestmentTable';
import { RMBRedeemedInvestmentsTable } from './common/RMBRedeemedInvestmentsTable';
import { DepositTable } from './common/DepositTable';
import { RedeemedDepositsTable } from './common/RedeemedDepositsTable';
import { 
  USDInvestmentDetail, 
  USDInvestmentDetailWithDates, 
  USDRedeemedInvestment,
  RMBInvestmentDetail,
  RMBInvestmentDetailWithDates,
  RMBRedeemedInvestment,
  DepositDetail,
  DepositDetailWithDates,
  RedeemedDeposit
} from '../data/dataTypes';
import { usdInvestmentData, DEFAULT_DATE } from '../data/usdInvestmentData';
import { USDRedeemedInvestmentData } from '../data/USDredeemedInvestments';
import { redeemedRmbInvestmentData } from '../data/redeemedRmbInvestments';
import { rmbInvestmentData } from '../data/rmbInvestmentData';
import { depositInvestmentData } from '../data/depositData';
import { redeemedDepositData } from '../data/redeemedDeposits';
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
  const [depositData, setDepositData] = useState(depositInvestmentData);
  const [redeemedData, setRedeemedData] = useState<USDRedeemedInvestment[]>([]);
  const [redeemedRmbData, setRedeemedRmbData] = useState<RMBRedeemedInvestment[]>([]);
  const [redeemedDepositData, setRedeemedDepositData] = useState<RedeemedDeposit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingRmb, setIsAddingRmb] = useState(false);
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);
  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<USDInvestmentDetailWithDates[]>([]);
  const [editedRmbData, setEditedRmbData] = useState<RMBInvestmentDetailWithDates[]>([]);
  const [editedDepositData, setEditedDepositData] = useState<DepositDetailWithDates[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasRmbChanges, setHasRmbChanges] = useState(false);
  const [hasDepositChanges, setHasDepositChanges] = useState(false);  // 初始化数据
  useEffect(() => {
    setData(usdInvestmentData);
    setRmbData(rmbInvestmentData);
    setRedeemedData(USDRedeemedInvestmentData);
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

  const depositWithDates = useMemo(() => {
    return depositData.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialRMB, holdingDays);
      
      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as DepositDetailWithDates;
    });
  }, [depositData, currentDate]);

  useEffect(() => {
    if (!hasChanges) {
      setEditedData(dataWithDates);
    }
    if (!hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
    }
    if (!hasDepositChanges) {
      setEditedDepositData(depositWithDates);
    }
  }, [dataWithDates, hasChanges, rmbDataWithDates, hasRmbChanges, depositWithDates, hasDepositChanges]);

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddRmb = () => {
    setIsAddingRmb(true);
  };

  const handleAddDeposit = () => {
    setIsAddingDeposit(true);
  };

  const handleSaveToFile = async (
    newData: USDInvestmentDetail[], 
    newRmbData?: RMBInvestmentDetail[],
    newDepositData?: DepositDetail[],
    newRedeemedData?: USDRedeemedInvestment[], 
    newRedeemedRmbData?: RMBRedeemedInvestment[],
    newRedeemedDepositData?: RedeemedDeposit[]
  ) => {
    setIsSaving(true);
    const success = await saveToFile(
      newData, 
      newRedeemedData || redeemedData, 
      newRmbData || rmbData,
      newRedeemedRmbData || redeemedRmbData,
      newDepositData || depositData,
      newRedeemedDepositData || redeemedDepositData
    );
    setIsSaving(false);
    if (!success) {
      alert('保存失败，请稍后重试');
    }
    return success;
  };

  const handleSave = async (newItem: USDInvestmentDetail | RMBInvestmentDetail | DepositDetail) => {
    if ('initialUSD' in newItem) {
      // USD investment
      const newData = [...data, newItem as USDInvestmentDetail];
      const success = await handleSaveToFile(newData);
      if (success) {
        setData(newData);
        setIsAdding(false);
      }
    } else if ('type' in newItem && newItem.type === '存款') {
      // Deposit
      const newData = [...depositData, newItem as DepositDetail];
      const success = await handleSaveToFile(data, rmbData, newData);
      if (success) {
        setDepositData(newData);
        setIsAddingDeposit(false);
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

  const handleUpdateDepositItem = (index: number, updates: Partial<DepositDetailWithDates>) => {
    setEditedDepositData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
    setHasDepositChanges(true);
  };

  const handleSaveAll = async () => {
    if (!hasChanges && !hasRmbChanges && !hasDepositChanges) return;
    
    const success = await handleSaveToFile(
      hasChanges ? editedData : data,
      hasRmbChanges ? editedRmbData : rmbData,
      hasDepositChanges ? editedDepositData : depositData
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
      if (hasDepositChanges) {
        setDepositData(editedDepositData);
        setHasDepositChanges(false);
      }
    }
  };

  const handleDelete = async (item: USDInvestmentDetailWithDates | RMBInvestmentDetailWithDates | DepositDetailWithDates) => {
    if (window.confirm('确定要赎回该产品？赎回后将保存到历史记录中。')) {
      if ('initialUSD' in item) {
        // USD investment
        const usdItem = item as USDInvestmentDetailWithDates;
        const redeemedItem: USDRedeemedInvestment = {
          ...usdItem,
          redeemDate: currentDate,
          finalUSD: usdItem.currentUSD,
          finalRate: usdItem.currentRate,
          finalRMB: usdItem.currentRMB,
          finalProfit: usdItem.profit
        };

        const newRedeemedData = [...redeemedData, redeemedItem];
        const newData = data.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(newData, undefined, undefined, newRedeemedData);
        if (success) {
          setRedeemedData(newRedeemedData);
          setData(newData);
        }
      } else if ('type' in item && item.type === '存款') {
        // Deposit
        const depositItem = item as DepositDetailWithDates;
        const redeemedItem: RedeemedDeposit = {
          ...depositItem,
          redeemDate: currentDate,
          finalRMB: depositItem.currentRMB,
          finalProfit: depositItem.profit
        };

        const newRedeemedDepositData = [...redeemedDepositData, redeemedItem];
        const newData = depositData.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(data, rmbData, newData, undefined, undefined, newRedeemedDepositData);
        if (success) {
          setRedeemedDepositData(newRedeemedDepositData);
          setDepositData(newData);
        }
      } else {
        // RMB investment
        const rmbItem = item as RMBInvestmentDetailWithDates;
        const redeemedItem: RMBRedeemedInvestment = {
          ...rmbItem,
          redeemDate: currentDate,
          finalRMB: rmbItem.currentRMB,
          finalProfit: rmbItem.profit
        };

        const newRedeemedRmbData = [...redeemedRmbData, redeemedItem];
        const newData = rmbData.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(data, newData, undefined, undefined, newRedeemedRmbData);
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
    setIsAddingDeposit(false);
    if (hasChanges) {
      setEditedData(dataWithDates);
      setHasChanges(false);
    }
    if (hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
      setHasRmbChanges(false);
    }
    if (hasDepositChanges) {
      setEditedDepositData(depositWithDates);
      setHasDepositChanges(false);
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
  const displayDepositData = hasDepositChanges ? editedDepositData : depositWithDates;

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
          <button
            onClick={handleAddDeposit}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
          >
            新增存款
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

      <ChartContainer 
        title="存款详情" 
        description="展示所有存款的详细信息。"
        useFixedHeight={false}
      >
        {isAddingDeposit ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="deposit"
          />
        ) : (
          <DepositTable 
            data={displayDepositData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateDepositItem}
            onSaveAll={hasDepositChanges ? handleSaveAll : undefined}
          />
        )}
      </ChartContainer>

      {redeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回美元产品记录" 
          description="展示所有已赎回美元产品的最终收益情况。"
          useFixedHeight={false}
        >
          <USDRedeemedInvestmentsTable data={redeemedData} />
        </ChartContainer>
      )}      {redeemedRmbData.length > 0 && (
        <ChartContainer 
          title="已赎回人民币产品记录" 
          description="展示所有已赎回人民币产品的最终收益情况。"
          useFixedHeight={false}
        >
          <RMBRedeemedInvestmentsTable data={redeemedRmbData} />
        </ChartContainer>
      )}
      {redeemedDepositData.length > 0 && (
        <ChartContainer 
          title="已赎回存款记录" 
          description="展示所有已赎回存款的最终收益情况。"
          useFixedHeight={false}
        >
          <RedeemedDepositsTable data={redeemedDepositData} />
        </ChartContainer>
      )}
    </div>
  );
};

export default FinancialPage;
