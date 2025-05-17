import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from './common/ChartContainer';
import { USDTable_A } from './common/USDTable';
import { USDRedeemedInvestmentsTable } from './common/USDRedeemedInvestmentsTable';
import { RMBTable_A } from './common/RMBTable';
import { RMBRedeemedInvestmentsTable } from './common/RMBRedeemedInvestmentsTable';
import { DepositTable_A } from './common/DepositTable';
import { DepositRedeemedTable } from './common/DepositRedeemedTable';
import { FundTable_A } from './common/FundTable';
import { FundRedeemedInvestmentsTable } from './common/FundRedeemedInvestmentsTable';
import { PensionTable_A } from './common/PensionTable';
import { PensionRedeemedTable } from './common/PensionRedeemedTable';
import { StockTable_A } from './common/StockTable';
import { StockRedeemedInvestmentsTable } from './common/StockRedeemedInvestmentsTable';
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
  FundRedeemedInvestment,
  PensionDetail,
  PensionDetailWithDates,
  PensionRedeemed,
  StockInvestmentDetail,
  StockInvestmentDetailWithDates,
  StockRedeemedInvestment
} from '../data/dataTypes';
import { USDData, DEFAULT_DATE } from '../data/USD_Data';
import { USDRedeemedData } from '../data/USDRedeemed';
import { RMBData } from '../data/RMB_Data';
import { RMBRedeemedData } from '../data/RMBRedeemed';
import { DepositData } from '../data/Deposit_Data';
import { DepositRedeemedData } from '../data/DepositRedeemed';
import { FundData } from '../data/Fund_Data';
import { FundRedeemedData } from '../data/FundRedeemed';
import { PensionData } from '../data/Pension_Data';
import { PensionRedeemedData } from '../data/PensionRedeemed';
import { StockData } from '../data/Stock_Data';
import { StockRedeemedData } from '../data/StockRedeemed';
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
  const [usdData, setUsdData] = useState(USDData);
  const [rmbData, setRmbData] = useState(RMBData);
  const [fundData, setFundData] = useState(FundData);
  const [pensionData, setPensionData] = useState(PensionData);
  const [depositData, setDepositData] = useState(DepositData);
  const [stockData, setStockData] = useState(StockData);
  const [USDRedeemedData, setRedeemedUsdData] = useState<USDRedeemedInvestment[]>([]);
  const [RMBRedeemedData, setRedeemedRmbData] = useState<RMBRedeemedInvestment[]>([]);
  const [FundRedeemedData, setRedeemedFundData] = useState<FundRedeemedInvestment[]>([]);
  const [DepositRedeemedData, setRedeemedDepositData] = useState<DepositRedeemed[]>([]);
  const [PensionRedeemedData, setRedeemedPensionData] = useState<PensionRedeemed[]>([]);
  const [StockRedeemedData, setRedeemedStockData] = useState<StockRedeemedInvestment[]>([]);
  const [isAddingUsd, setIsAddingUsd] = useState(false);
  const [isAddingRmb, setIsAddingRmb] = useState(false);
  const [isAddingFund, setIsAddingFund] = useState(false);
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);
  const [isAddingPension, setIsAddingPension] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUsdData, setEditedUsdData] = useState<USDInvestmentDetailWithDates[]>([]);
  const [editedRmbData, setEditedRmbData] = useState<RMBInvestmentDetailWithDates[]>([]);
  const [editedFundData, setEditedFundData] = useState<FundInvestmentDetailWithDates[]>([]);
  const [editedDepositData, setEditedDepositData] = useState<DepositDetailWithDates[]>([]);
  const [editedPensionData, setEditedPensionData] = useState<PensionDetailWithDates[]>([]);
  const [editedStockData, setEditedStockData] = useState<StockInvestmentDetailWithDates[]>([]);
  const [hasUsdChanges, setHasUsdChanges] = useState(false);
  const [hasRmbChanges, setHasRmbChanges] = useState(false);
  const [hasFundChanges, setHasFundChanges] = useState(false);
  const [hasDepositChanges, setHasDepositChanges] = useState(false);
  const [hasPensionChanges, setHasPensionChanges] = useState(false);
  const [hasStockChanges, setHasStockChanges] = useState(false);
  useEffect(() => {
    setUsdData(USDData);
    setRmbData(RMBData);
    setDepositData(DepositData);
    setFundData(FundData);
    setPensionData(PensionData);
    setStockData(StockData);
    setRedeemedUsdData(USDRedeemedData);
    setRedeemedRmbData(RMBRedeemedData);
    setRedeemedDepositData(DepositRedeemedData);
    setRedeemedFundData(FundRedeemedData);
    setRedeemedPensionData(PensionRedeemedData);
    setRedeemedStockData(StockRedeemedData);
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

  const pensionWithDates = useMemo(() => {
    return pensionData.map(item => {
      return {
       ...item
      } as PensionDetailWithDates;
    });
  }, [pensionData]);

  const stockWithDates = useMemo(() => {
    return stockData.map(item => {
      const holdingDays = calculateDaysBetween(item.purchaseDate, currentDate);
      const annualizedReturn = calculateAnnualizedReturn(item.profit, item.initialStock, holdingDays);

      return {
        ...item,
        holdingDays,
        annualizedReturn
      } as StockInvestmentDetailWithDates;
    });
  }, [stockData, currentDate]);

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
    if (!hasPensionChanges) {
      setEditedPensionData(pensionWithDates);
    }
    if (!hasStockChanges) {
      setEditedStockData(stockWithDates);
    }
  }, [usdDataWithDates, hasUsdChanges, 
    rmbDataWithDates, hasRmbChanges, 
    fundDataWithDates, hasFundChanges, 
    depositWithDates, hasDepositChanges, 
    pensionWithDates, hasPensionChanges,
    stockWithDates, hasStockChanges
  ]);

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

  const handleAddPension = () => {
    setIsAddingPension(true);
  };

  const handleAddStock = () => {
    setIsAddingStock(true);
  };

  const handleSaveToFile = async (
    newUsdData: USDInvestmentDetail[], 
    newUSDRedeemedData?: USDRedeemedInvestment[], 
    newRmbData?: RMBInvestmentDetail[],
    newRedeemedRmbData?: RMBRedeemedInvestment[],
    newDepositData?: DepositDetail[],
    newRedeemedDepositData?: DepositRedeemed[],
    newFundData?: FundInvestmentDetail[],
    newRedeemedFundData?: FundRedeemedInvestment[],
    newPensionData?: PensionDetail[],
    newRedeemedPensionData?: PensionRedeemed[],
    newStockData?: StockInvestmentDetail[],
    newRedeemedStockData?: StockRedeemedInvestment[]
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
      newRedeemedFundData || FundRedeemedData,
      newPensionData || pensionData,
      newRedeemedPensionData || PensionRedeemedData,
      newStockData || stockData,
      newRedeemedStockData || StockRedeemedData
    );
    setIsSaving(false);
    if (!success) {
      alert('保存失败，请稍后重试');
    }
    return success;
  };

  const handleSave = async (newItem: USDInvestmentDetail | RMBInvestmentDetail | DepositDetail | FundInvestmentDetail | PensionDetail | StockInvestmentDetail) => {
    if ('initialUSD' in newItem) {
      // USD investment
      const newUsdDataSave = [...usdData, newItem as USDInvestmentDetail];
      const success = await handleSaveToFile(newUsdDataSave);
      if (success) {
        setUsdData(newUsdDataSave.map(item => ({
          ...item,
          holdingDays: calculateDaysBetween(item.purchaseDate, currentDate),
          annualizedReturn: calculateAnnualizedReturn(
            item.profit,
            item.initialRMB,
            calculateDaysBetween(item.purchaseDate, currentDate)
          )
        })));
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
    } else if (newItem.app.includes('养老') || newItem.name.includes('养老')) {
      // Pension
      const newPensionData = [...pensionData, newItem as PensionDetail];
      const success = await handleSaveToFile(usdData,undefined,undefined,undefined, undefined,undefined, undefined, undefined, newPensionData);
      if (success) {
        setPensionData(newPensionData);
        setIsAddingPension(false);
      }
    } else if ('initialStock' in newItem) {
      // Stock
      const newStockData = [...stockData, newItem as StockInvestmentDetail];
      const success = await handleSaveToFile(usdData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, newStockData);
      if (success) {
        setStockData(newStockData);
        setIsAddingStock(false);
      }
    }else {
      // Deposit
      const newDepositData = [...depositData, newItem as DepositDetail];
      const success = await handleSaveToFile(usdData, undefined, undefined, undefined, newDepositData);
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
  
  const handleUpdatePensionItem = (index: number, updates: Partial<PensionDetailWithDates>) => {
    setEditedPensionData(prevData => {
      const newData = [...prevData];
      newData[index] = {...newData[index],...updates };
      return newData;
    });
    setHasPensionChanges(true);
  };

  const handleUpdateStockItem = (index: number, updates: Partial<StockInvestmentDetailWithDates>) => {
    setEditedStockData(prevData => {
      const newData = [...prevData];
      newData[index] = {...newData[index],...updates };
      return newData;
    });
    setHasStockChanges(true);
  };

  const handleSaveAll = async () => {
    if (!hasUsdChanges && !hasRmbChanges && !hasDepositChanges && !hasFundChanges && !hasPensionChanges && !hasStockChanges) return;

    const success = await handleSaveToFile(
      hasUsdChanges ? editedUsdData : usdData,
      undefined,
      hasRmbChanges ? editedRmbData : rmbData,
      undefined,
      hasDepositChanges ? editedDepositData : depositData,
      undefined,
      hasFundChanges ? editedFundData : fundData,
      undefined,
      hasPensionChanges? editedPensionData : pensionData,
      undefined,
      hasStockChanges ? editedStockData : stockData,
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
      if (hasPensionChanges) {
        setPensionData(editedPensionData);
        setHasPensionChanges(false);
      }
      if (hasStockChanges) {
        setStockData(editedStockData);
        setHasStockChanges(false);
      }
    }
  };

  const handleDelete = async (item: USDInvestmentDetailWithDates | RMBInvestmentDetailWithDates | DepositDetailWithDates | FundInvestmentDetailWithDates | PensionDetailWithDates | StockInvestmentDetailWithDates) => {
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
      } else if (item.app.includes('养老') || item.name.includes('养老')){
        // Pension
        const pensionItem = item as PensionDetailWithDates;
        const redeemedItem: PensionRedeemed = {
         ...pensionItem,
          redeemDate: currentDate,
          finalRMB: pensionItem.currentRMB
        };

        const newRedeemedPensionData = [...PensionRedeemedData, redeemedItem];
        const newPensionData = pensionData.filter(d => d.app!== pensionItem.app || d.name!== pensionItem.name);

        const success = await handleSaveToFile(usdData,undefined, undefined, undefined, undefined, undefined, undefined, undefined, newPensionData, newRedeemedPensionData);
        if (success) {
          setRedeemedPensionData(newRedeemedPensionData);
          setPensionData(newPensionData);
        }
      } else if ('initialStock' in item) {
        // Stock
        const stockItem = item as StockInvestmentDetailWithDates;
        const redeemedItem: StockRedeemedInvestment = {
          ...stockItem,
          redeemDate: currentDate,
          finalStock: stockItem.currentStock,
          finalProfit: stockItem.profit
        };

        const newRedeemedStockData = [...StockRedeemedData, redeemedItem];
        const newStockData = stockData.filter(d => d.app !== stockItem.app || d.name !== stockItem.name);

        const success = await handleSaveToFile(usdData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, newStockData, newRedeemedStockData);
        if (success) {
          setRedeemedStockData(newRedeemedStockData);
          setStockData(newStockData);
        }
      }else {
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
    setIsAddingPension(false);
    setIsAddingStock(false);
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
    if (hasPensionChanges) {
      setEditedPensionData(pensionWithDates);
      setHasPensionChanges(false);
    }
    if (hasStockChanges) {
      setEditedStockData(stockWithDates);
      setHasStockChanges(false);
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
  const displayPensionData = hasPensionChanges? editedPensionData : pensionWithDates;
  const displayStockData = hasStockChanges ? editedStockData : stockWithDates;

  // 检查是否有任何数据变更
  const hasAnyChanges = hasUsdChanges || hasRmbChanges || hasDepositChanges || hasFundChanges || hasPensionChanges || hasStockChanges;

  return (
    <div className="space-y-8 relative pb-20"> {/* 添加相对定位和底部内边距，为固定按钮腾出空间 */}
      {/* 全局保存按钮 */}
      {hasAnyChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-3 px-4 z-50 flex justify-center">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2 text-lg font-medium"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>保存中...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>保存全部更改</span>
              </>
            )}
          </button>
        </div>
      )}
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
          <button
            onClick={handleAddPension}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            新增养老金
          </button>
          <button
            onClick={handleAddStock}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md"
          >
            新增股票
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {hasAnyChanges && (
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                '保存所有修改'
              )}
            </button>
          )}
          <input
            type="date"
            value={currentDate.split('/').join('-')}
            onChange={(e) => handleDateChange(e.target.value.split('-').join('/'))}
            className="px-4 py-2 text-sm border rounded-md"
          />
        </div>
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
          <USDTable_A 
            usdData={displayUsdData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateUsdItem}
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
          <RMBTable_A 
            rmbData={displayRmbData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateRmbItem}
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
          <DepositTable_A 
            depositData={displayDepositData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateDepositItem}
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
          <FundTable_A 
            fundData={displayFundData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateFundItem}
          />
        )}
      </ChartContainer>

      <ChartContainer
        title="养老金详情"
        description="展示所有养老金的详细信息。"
        useFixedHeight={false}
      >
        {isAddingPension? (
          <AddForm
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="pension"
          />
        ) : (
          <PensionTable_A
            pensionData={displayPensionData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdatePensionItem}
          />
        )}
      </ChartContainer>


      <ChartContainer 
        title="股票详情" 
        description="展示所有股票的详细信息。"
        useFixedHeight={false}
      >
        {isAddingStock ? (
          <AddForm
            currentDate={currentDate}
            onSave={handleSave}
            onCancel={handleCancel}
            type="stock"
          />
        ) : (
          <StockTable_A
            stockData={displayStockData}
            onDelete={handleDelete}
            onUpdateItem={handleUpdateStockItem}
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
          <DepositRedeemedTable depositData={DepositRedeemedData} />
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
      {PensionRedeemedData.length > 0 && (
        <ChartContainer
          title="已赎回养老金记录"
          description="展示所有已赎回养老金的最终收益情况。"
          useFixedHeight={false}
        >
          <PensionRedeemedTable pensionData={PensionRedeemedData} />
        </ChartContainer>
      )}
      {StockRedeemedData.length > 0 && (
        <ChartContainer
          title="已赎回股票记录"
          description="展示所有已赎回股票的最终收益情况。"
          useFixedHeight={false}
        >
          <StockRedeemedInvestmentsTable stockData={StockRedeemedData} />
        </ChartContainer>
      )}
    </div>
  );
};

export default FinancialPage;
