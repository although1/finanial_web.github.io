import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDInvestmentTable } from './common/USDInvestmentTable';
import { USDRedeemedInvestmentsTable } from './common/USDRedeemedInvestmentsTable';
import { RMBInvestmentTable } from './common/RMBInvestmentTable';
import { RMBRedeemedInvestmentsTable } from './common/RMBRedeemedInvestmentsTable';
import { DepositTable } from './common/DepositTable';
import { DepositsRedeemedTable } from './common/DepositsRedeemedTable';
import { FundInvestmentTable } from './common/FundInvestmentTable';
import { FundRedeemedInvestmentsTable } from './common/FundRedeemedInvestmentsTable';
import { 
  USDInvestmentDetail, 
  USDInvestmentDetailWithDates, 
  USDRedeemedInvestment,
  RMBInvestmentDetail,
  RMBInvestmentDetailWithDates,
  RMBRedeemedInvestment,
  DepositDetail,
  DepositDetailWithDates,
  DepositRedeemed,
  FundInvestmentDetail,
  FundInvestmentDetailWithDates,
  FundRedeemedInvestment
} from '../data/dataTypes';
import { USDInvestmentData, DEFAULT_DATE } from '../data/USDInvestmentData';
import { USDRedeemedInvestmentData } from '../data/USDRedeemedInvestments';
import { RMBInvestmentData } from '../data/RMBInvestmentData';
import { RMBRedeemedInvestmentData } from '../data/RMBRedeemedInvestments';
import { depositInvestmentData } from '../data/depositData';
import { DepositRedeemedData } from '../data/DepositsRedeemed';
import { FundInvestmentData } from '../data/FundInvestmentData';
import { FundRedeemedInvestmentData } from '../data/FundRedeemedInvestments';
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
  const [usdData, setUsdData] = useState(USDInvestmentData);
  const [rmbData, setRmbData] = useState(RMBInvestmentData);
  const [fundData, setFundData] = useState(FundInvestmentData);
  const [depositData, setDepositData] = useState(depositInvestmentData);
  const [USDRedeemedData, setRedeemedUsdData] = useState<USDRedeemedInvestment[]>([]);
  const [RMBRedeemedData, setRedeemedRmbData] = useState<RMBRedeemedInvestment[]>([]);
  const [FundRedeemedData, setRedeemedFundData] = useState<FundRedeemedInvestment[]>([]);
  const [DepositRedeemedData, setRedeemedDepositData] = useState<DepositRedeemed[]>([]);
  const [isAddingUsd, setIsAddingUsd] = useState(false);
  const [isAddingRmb, setIsAddingRmb] = useState(false);
  const [isAddingFund, setIsAddingFund] = useState(false);
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);
  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUsdData, setEditedUsdData] = useState<USDInvestmentDetailWithDates[]>([]);
  const [editedRmbData, setEditedRmbData] = useState<RMBInvestmentDetailWithDates[]>([]);
  const [editedFundData, setEditedFundData] = useState<FundInvestmentDetailWithDates[]>([]);
  const [editedDepositData, setEditedDepositData] = useState<DepositDetailWithDates[]>([]);
  const [hasUsdChanges, setHasUsdChanges] = useState(false);
  const [hasRmbChanges, setHasRmbChanges] = useState(false);
  const [hasFundChanges, setHasFundChanges] = useState(false);
  const [hasDepositChanges, setHasDepositChanges] = useState(false);  // 初始化数据
  useEffect(() => {
    setUsdData(USDInvestmentData);
    setRmbData(RMBInvestmentData);
    setFundData(FundInvestmentData);
    setDepositData(depositInvestmentData);
    setRedeemedUsdData(USDRedeemedInvestmentData);
    setRedeemedRmbData(RMBRedeemedInvestmentData);
    setRedeemedDepositData(DepositRedeemedData);
    setRedeemedFundData(FundRedeemedInvestmentData);
  }, []);

  const usdDataWithDates = useMemo(() => {
    return usdData.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialRMB, holdingDays);
      
      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as USDInvestmentDetailWithDates;
    });
  }, [usdData, currentDate]);

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

    const fundDataWithDates = useMemo(() => {
    return fundData.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialFund, holdingDays);
      
      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as FundInvestmentDetailWithDates;
    });
  }, [fundData, currentDate]);

  const depositWithDates = useMemo(() => {
    return depositData.map(item => {
      return {
        ...item
      } as DepositDetailWithDates;
    });
  }, [depositData]);

  useEffect(() => {
    if (!hasUsdChanges) {
      setEditedUsdData(usdDataWithDates);
    }
    if (!hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
    }
    if (!hasFundChanges) {
      setEditedFundData(fundDataWithDates);
    } 
    if (!hasDepositChanges) {
      setEditedDepositData(depositWithDates);
    }
  }, [usdDataWithDates, hasUsdChanges, rmbDataWithDates, hasRmbChanges, fundDataWithDates, hasFundChanges, depositWithDates, hasDepositChanges]);

  const handleAdd = () => {
    setIsAddingUsd(true);
  };

  const handleAddRmb = () => {
    setIsAddingRmb(true);
  };

  const handleAddFund = () => {
    setIsAddingFund(true);
  };

  const handleAddDeposit = () => {
    setIsAddingDeposit(true);
  };

  const handleSaveToFile = async (
    newUsdData: USDInvestmentDetail[], 
    newUSDRedeemedData?: USDRedeemedInvestment[], 
    newRmbData?: RMBInvestmentDetail[],
    newRedeemedRmbData?: RMBRedeemedInvestment[],
    newDepositData?: DepositDetail[],
    newRedeemedDepositData?: DepositRedeemed[],
    newFundData?: FundInvestmentDetail[],
    newRedeemedFundData?: FundRedeemedInvestment[]
  ) => {
    setIsSaving(true);
    const success = await saveToFile(
      newUsdData || usdData, 
      newUSDRedeemedData || USDRedeemedData, 
      newRmbData || rmbData,
      newRedeemedRmbData || RMBRedeemedData,
      newDepositData || depositData,
      newRedeemedDepositData || DepositRedeemedData,
      newFundData || fundData,
      newRedeemedFundData || FundRedeemedData
    );
    setIsSaving(false);
    if (!success) {
      alert('保存失败，请稍后重试');
    }
    return success;
  };

  const handleSave = async (newItem: USDInvestmentDetail | RMBInvestmentDetail | DepositDetail | FundInvestmentDetail) => {
    if ('initialUSD' in newItem) {
      // USD investment
      const newUsdDataSave = [...usdData, newItem as USDInvestmentDetail];
      const success = await handleSaveToFile(newUsdDataSave);
      if (success) {
        setUsdData(newUsdDataSave);
        setIsAddingUsd(false);
      }
    } else if ('initialRMB' in newItem) {
      // RMB investment
      const newData = [...rmbData, newItem as RMBInvestmentDetail];
      const success = await handleSaveToFile(usdData,undefined, newData);
      if (success) {
        setRmbData(newData);
        setIsAddingRmb(false);
      }

    } else if ('initialFund' in newItem) {
      // Fund
      const newFundData = [...fundData, newItem as FundInvestmentDetail];
      const success = await handleSaveToFile(usdData,undefined,undefined,undefined, undefined,undefined, newFundData);
      if (success) {
        setFundData(newFundData);
        setIsAddingFund(false);
      }
    }  else {
      // Deposit
      const newDepositData = [...depositData, newItem as DepositDetail];
      const success = await handleSaveToFile(usdData,undefined,undefined,undefined, newDepositData);
      if (success) {
        setDepositData(newDepositData);
        setIsAddingDeposit(false);
      }
    }
  };

  const handleUpdateUsdItem = (index: number, updates: Partial<USDInvestmentDetailWithDates>) => {
    setEditedUsdData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
    setHasUsdChanges(true);
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

  const handleUpdateFundItem = (index: number, updates: Partial<FundInvestmentDetailWithDates>) => {
    setEditedFundData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
    setHasFundChanges(true);
  };

  const handleSaveAll = async () => {
    if (!hasUsdChanges && !hasRmbChanges && !hasDepositChanges && !hasFundChanges) return;

    const success = await handleSaveToFile(
      hasUsdChanges ? editedUsdData : usdData,
      undefined,
      hasRmbChanges ? editedRmbData : rmbData,
      undefined,
      hasDepositChanges ? editedDepositData : depositData,
      undefined,
      hasFundChanges ? editedFundData : fundData,
      undefined
    );
    if (success) {
      if (hasUsdChanges) {
        setUsdData(editedUsdData);
        setHasUsdChanges(false);
      }
      if (hasRmbChanges) {
        setRmbData(editedRmbData);
        setHasRmbChanges(false);
      }
      if (hasDepositChanges) {
        setDepositData(editedDepositData);
        setHasDepositChanges(false);
      }
      if (hasFundChanges) {
        setFundData(editedFundData);
        setHasFundChanges(false);
      }
    }
  };

  const handleDelete = async (item: USDInvestmentDetailWithDates | RMBInvestmentDetailWithDates | DepositDetailWithDates | FundInvestmentDetailWithDates) => {
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

        const newUSDRedeemedData = [...USDRedeemedData, redeemedItem];
        const newUsdData = usdData.filter(d => d.app !== usdItem.app || d.name !== usdItem.name);
        
        const success = await handleSaveToFile(newUsdData, newUSDRedeemedData,undefined, undefined, undefined, undefined);
        if (success) {
          setRedeemedUsdData(newUSDRedeemedData);
          setUsdData(newUsdData);
        }
      } else if ('initialRMB' in item) {
        // RMB investment
        const rmbItem = item as RMBInvestmentDetailWithDates;
        const redeemedItem: RMBRedeemedInvestment = {
          ...rmbItem,
          redeemDate: currentDate,
          finalRMB: rmbItem.currentRMB,
          finalProfit: rmbItem.profit
        };

        const newRedeemedRmbData = [...RMBRedeemedData, redeemedItem];
        const newData = rmbData.filter(d => d.app !== item.app || d.name !== item.name);
        
        const success = await handleSaveToFile(usdData,undefined, newData, newRedeemedRmbData, undefined, undefined);
        if (success) {
          setRedeemedRmbData(newRedeemedRmbData);
          setRmbData(newData);
        }
      } else if ('initialFund' in item) {
        // Fund investment
        const fundItem = item as FundInvestmentDetailWithDates;
        const redeemedItem: FundRedeemedInvestment = {
          ...fundItem,
          redeemDate: currentDate,
          finalFund: fundItem.currentFund,
          finalProfit: fundItem.profit
        };

        const newRedeemedFundData = [...FundRedeemedData, redeemedItem];
        const newData = fundData.filter(d => d.app !== item.app || d.name !== item.name);

        const success = await handleSaveToFile(usdData,undefined, undefined, undefined, undefined, undefined, newData, newRedeemedFundData);
        if (success) {
          setRedeemedFundData(newRedeemedFundData);
          setFundData(newData);
        }
      } else {
        // Deposit
        const depositItem = item as DepositDetailWithDates;
        const redeemedItem: DepositRedeemed = {
          ...depositItem,
          redeemDate: currentDate,
          finalRMB: depositItem.currentRMB
        };

        const newRedeemedDepositData = [...DepositRedeemedData, redeemedItem];
        const newDepositData = depositData.filter(d => d.app !== depositItem.app || d.name !== depositItem.name);
        
        const success = await handleSaveToFile(usdData, undefined, undefined, undefined, newDepositData, newRedeemedDepositData);
        if (success) {
          setRedeemedDepositData(newRedeemedDepositData);
          setDepositData(newDepositData);
        }
      }
    }
  };

  const handleCancel = () => {
    setIsAddingUsd(false);
    setIsAddingRmb(false);
    setIsAddingDeposit(false);
    setIsAddingFund(false);
    if (hasUsdChanges) {
      setEditedUsdData(usdDataWithDates);
      setHasUsdChanges(false);
    }
    if (hasRmbChanges) {
      setEditedRmbData(rmbDataWithDates);
      setHasRmbChanges(false);
    }
    if (hasDepositChanges) {
      setEditedDepositData(depositWithDates);
      setHasDepositChanges(false);
    }
    if (hasFundChanges) {
      setEditedFundData(fundDataWithDates);
      setHasFundChanges(false);
    }
  };

  const handleDateChange = (newDate: string) => {
    if (!isValidDate(newDate)) {
      alert(`不能选择超过${SYSTEM_DATE}的日期`);
      return;
    }
    setCurrentDate(newDate);
  };

  const displayUsdData = hasUsdChanges ? editedUsdData : usdDataWithDates;
  const displayRmbData = hasRmbChanges ? editedRmbData : rmbDataWithDates;
  const displayDepositData = hasDepositChanges ? editedDepositData : depositWithDates;
  const displayFundData = hasFundChanges ? editedFundData : fundDataWithDates;

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
          <button
            onClick={handleAddFund}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
          >
            新增基金
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
        {isAddingUsd ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="usd"
          />
        ) : (
          <USDInvestmentTable 
            usdData={displayUsdData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateUsdItem}
            onSaveAll={hasUsdChanges ? handleSaveAll : undefined}
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
            rmbData={displayRmbData}
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
            depositData={displayDepositData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateDepositItem}
            onSaveAll={hasDepositChanges ? handleSaveAll : undefined}
          />
        )}
      </ChartContainer>

      <ChartContainer 
        title="基金详情" 
        description="展示所有基金的详细信息。"
        useFixedHeight={false}
      >
        {isAddingFund ? (
          <AddForm 
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="fund"
          />
        ) : (
          <FundInvestmentTable 
            fundData={displayFundData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateFundItem}
            onSaveAll={hasFundChanges ? handleSaveAll : undefined}
          />
        )}
      </ChartContainer>

      {USDRedeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回美元产品记录" 
          description="展示所有已赎回美元产品的最终收益情况。"
          useFixedHeight={false}
        >
          <USDRedeemedInvestmentsTable usdData={USDRedeemedData} />
        </ChartContainer>
      )}      
      {RMBRedeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回人民币产品记录" 
          description="展示所有已赎回人民币产品的最终收益情况。"
          useFixedHeight={false}
        >
          <RMBRedeemedInvestmentsTable rmbData={RMBRedeemedData} />
        </ChartContainer>
      )}
      {DepositRedeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回存款记录" 
          description="展示所有已赎回存款的最终收益情况。"
          useFixedHeight={false}
        >
          <DepositsRedeemedTable depositData={DepositRedeemedData} />
        </ChartContainer>
      )}
      {FundRedeemedData.length > 0 && (
        <ChartContainer 
          title="已赎回基金记录" 
          description="展示所有已赎回基金的最终收益情况。"
          useFixedHeight={false}
        >
          <FundRedeemedInvestmentsTable fundData={FundRedeemedData} />
        </ChartContainer>
      )}
    </div>
  );
};

export default FinancialPage;
