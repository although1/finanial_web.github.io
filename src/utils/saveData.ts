import { 
  USDDetail, 
  USDRedeemed_I,
  RMBDetail,
  RMBRedeemed_I,
  DepositDetail,
  DepositRedeemed_I,
  FundDetail,
  FundRedeemed_I,
  PensionDetail,
  PensionRedeemed_I,
  StockDetail,
  StockRedeemed_I
} from '../data/dataTypes';

interface AppDetail {
  detail: {
    [key: string]: number;
  };
  total: number;
  total_profit: number;
}

interface AppTotalData {
  [key: string]: AppDetail;
}

interface AppTotals {
  [key: string]: AppDetail | number;
  grand_total: number;
  grand_total_profit: number;
}

const calculateAppTotals = (
  usdData: USDDetail[],
  rmbData: RMBDetail[] = [],
  depositData: DepositDetail[] = [],
  fundData: FundDetail[] = [],
  pensionData: PensionDetail[] = [],
  stockData: StockDetail[] = []
): AppTotals => {
  const appTotals: AppTotalData = {};
  let grandTotal = 0;
  let grandTotalProfit = 0;

  // 处理美元理财
  usdData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['美元理财']) {
      appTotals[item.app].detail['美元理财'] = 0;
      appTotals[item.app].detail['美元理财_收益'] = 0;
    }
    
    appTotals[item.app].detail['美元理财'] = parseFloat((appTotals[item.app].detail['美元理财'] + item.currentRMB).toFixed(2));
    appTotals[item.app].detail['美元理财_收益'] = parseFloat((appTotals[item.app].detail['美元理财_收益'] + item.profit).toFixed(2));
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentRMB).toFixed(2));
    appTotals[item.app].total_profit = parseFloat((appTotals[item.app].total_profit + item.profit).toFixed(2));
  });

  // 处理人民币理财
  rmbData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['人民币理财']) {
      appTotals[item.app].detail['人民币理财'] = 0;
      appTotals[item.app].detail['人民币理财_收益'] = 0;
    }
    
    appTotals[item.app].detail['人民币理财'] = parseFloat((appTotals[item.app].detail['人民币理财'] + item.currentRMB).toFixed(2));
    appTotals[item.app].detail['人民币理财_收益'] = parseFloat((appTotals[item.app].detail['人民币理财_收益'] + item.profit).toFixed(2));
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentRMB).toFixed(2));
    appTotals[item.app].total_profit = parseFloat((appTotals[item.app].total_profit + item.profit).toFixed(2));
  });

  // 处理存款
  depositData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['存款']) {
      appTotals[item.app].detail['存款'] = 0;
      appTotals[item.app].detail['存款_收益'] = 0;
    }
    
    appTotals[item.app].detail['存款'] = parseFloat((appTotals[item.app].detail['存款'] + item.currentRMB).toFixed(2));
    appTotals[item.app].detail['存款_收益'] = 0;
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentRMB).toFixed(2));
  });

  // 处理基金
  fundData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['基金']) {
      appTotals[item.app].detail['基金'] = 0;
      appTotals[item.app].detail['基金_收益'] = 0;
    }
    
    appTotals[item.app].detail['基金'] = parseFloat((appTotals[item.app].detail['基金'] + item.currentFund).toFixed(2));
    appTotals[item.app].detail['基金_收益'] = parseFloat((appTotals[item.app].detail['基金_收益'] + item.profit).toFixed(2));
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentFund).toFixed(2));
    appTotals[item.app].total_profit = parseFloat((appTotals[item.app].total_profit + item.profit).toFixed(2));
  });

  // 处理养老金
  pensionData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['养老金']) {
      appTotals[item.app].detail['养老金'] = 0;
      appTotals[item.app].detail['养老金_收益'] = 0;
    }
    
    appTotals[item.app].detail['养老金'] = parseFloat((appTotals[item.app].detail['养老金'] + item.currentRMB).toFixed(2));
    appTotals[item.app].detail['养老金_收益'] = 0;
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentRMB).toFixed(2));
  });

  // 处理股票
  stockData.forEach(item => {
    if (!appTotals[item.app]) {
      appTotals[item.app] = { detail: {}, total: 0, total_profit: 0 };
    }
    
    if (!appTotals[item.app].detail['股票']) {
      appTotals[item.app].detail['股票'] = 0;
      appTotals[item.app].detail['股票_收益'] = 0;
    }
    
    appTotals[item.app].detail['股票'] = parseFloat((appTotals[item.app].detail['股票'] + item.currentStock).toFixed(2));
    appTotals[item.app].detail['股票_收益'] = parseFloat((appTotals[item.app].detail['股票_收益'] + item.profit).toFixed(2));
    appTotals[item.app].total = parseFloat((appTotals[item.app].total + item.currentStock).toFixed(2));
    appTotals[item.app].total_profit = parseFloat((appTotals[item.app].total_profit + item.profit).toFixed(2));
  });

  // 计算总计
  Object.values(appTotals).forEach(app => {
    if ('total' in app) {
      grandTotal += app.total;
      grandTotalProfit += app.total_profit;
    }
  });

  return {
    ...appTotals,
    grand_total: parseFloat(grandTotal.toFixed(2)),
    grand_total_profit: parseFloat(grandTotalProfit.toFixed(2))
  } as AppTotals;
};

const saveAppTotals = async (
  selectedDate: string,
  appTotals: AppTotals
): Promise<boolean> => {
  try {
    const filename = `app_totals_${selectedDate.split('/').join('-')}.json`;
    const content = JSON.stringify(appTotals, null, 2);

    const response = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        content,
        isJson: true  // 添加标记表明这是 JSON 文件
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to save app totals:', error);
    return false;
  }
};

export const saveToFile = async (
  selectedDate: string,
  currentUSDData: USDDetail[], 
  redeemedUSDData?: USDRedeemed_I[],
  currentRMBData?: RMBDetail[],
  redeemedRMBData?: RMBRedeemed_I[],
  currentDepositData?: DepositDetail[],
  redeemedDepositData?: DepositRedeemed_I[],
  currentFundData?: FundDetail[],
  redeemedFundData?: FundRedeemed_I[],
  currentPensionData?: PensionDetail[],
  redeemedPensionData?: PensionRedeemed_I[],
  currentStockData?: StockDetail[],
  redeemedStockData?: StockRedeemed_I[]
): Promise<boolean> => {
  try {
    // Save USD investment data
    const usdDataStr = 'import { USDDetailWithDates } from \'./dataTypes\';\n\n' +
      'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
      'export const USDData: USDDetailWithDates[] = ' + 
      JSON.stringify(currentUSDData, null, 2) + ';\n';

    const usdResponse = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'USD_Data.ts', content: usdDataStr })
    });

    if (!usdResponse.ok) throw new Error('Failed to save USD data');

    // Save RMB investment data if provided
    if (currentRMBData) {
      const rmbDataStr = 'import { RMBDetailWithDates } from \'./dataTypes\';\n\n' +
        'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
        'export const RMBData: RMBDetailWithDates[] = ' + 
        JSON.stringify(currentRMBData, null, 2) + ';\n';

      const rmbResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'RMB_Data.ts',
          content: rmbDataStr
        })
      });

      if (!rmbResponse.ok) {
        throw new Error('Failed to save RMB investment data');
      }
    }

    // Save deposit data if provided
    if (currentDepositData) {
      const depositDataStr = 'import { DepositDetail } from \'./dataTypes\';\n\n' +
        'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
        'export const DepositData: DepositDetail[] = ' + 
        JSON.stringify(currentDepositData, null, 2) + ';\n';

      const depositResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'Deposit_Data.ts',
          content: depositDataStr
        })
      });

      if (!depositResponse.ok) {
        throw new Error('Failed to save deposit data');
      }
    }

    // Save fund data if provided
    if (currentFundData) {
      const fundDataStr = 'import { FundDetail } from \'./dataTypes\';\n\n' +
        'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
        'export const FundData: FundDetail[] = ' + 
        JSON.stringify(currentFundData, null, 2) + ';\n';

      const fundResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'Fund_Data.ts',
          content: fundDataStr
        })
      });

      if (!fundResponse.ok) {
        throw new Error('Failed to save fund investment data');
      }
    }

    // Save pension data if provided
    if (currentPensionData) {
      const pensionDataStr = 'import { PensionDetail } from \'./dataTypes\';\n\n' +
        'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
        'export const PensionData: PensionDetail[] = ' +
        JSON.stringify(currentPensionData, null, 2) + ';\n';

      const pensionResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'Pension_Data.ts',
          content: pensionDataStr
        })
      });

      if (!pensionResponse.ok) {
        throw new Error('Failed to save pension data');
      }
    }

    // Save stock data if provided
    if (currentStockData) {
      const stockDataStr = 'import { StockDetail } from \'./dataTypes\';\n\n' +
        'export const DEFAULT_DATE = \'' + selectedDate + '\';\n\n' +
        'export const StockData: StockDetail[] = ' +
        JSON.stringify(currentStockData, null, 2) + ';\n';

      const stockResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'Stock_Data.ts',
          content: stockDataStr
        })
      });

      if (!stockResponse.ok) {
        throw new Error('Failed to save stock data');
      }
    }

    // Save redeemed USD data if provided
    if (redeemedUSDData) {
      const redeemedUSDDataStr = 'import { USDRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const USDRedeemedData: USDRedeemed_I[] = ' + 
        JSON.stringify(redeemedUSDData, null, 2) + ';\n';

      const redeemedUSDResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'USDRedeemed.ts',
          content: redeemedUSDDataStr
        })
      });

      if (!redeemedUSDResponse.ok) {
        throw new Error('Failed to save redeemed USD investment data');
      }
    }

    // Save redeemed RMB data if provided
    if (redeemedRMBData) {
      const redeemedRMBDataStr = 'import { RMBRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const RMBRedeemedData: RMBRedeemed_I[] = ' + 
        JSON.stringify(redeemedRMBData, null, 2) + ';\n';

      const redeemedRMBResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'RMBRedeemed.ts',
          content: redeemedRMBDataStr
        })
      });

      if (!redeemedRMBResponse.ok) {
        throw new Error('Failed to save redeemed RMB investment data');
      }
    }

    // Save redeemed deposit data if provided
    if (redeemedDepositData) {
      const redeemedDepositDataStr = 'import { DepositRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const DepositRedeemedData: DepositRedeemed_I[] = ' + 
        JSON.stringify(redeemedDepositData, null, 2) + ';\n';

      const redeemedDepositResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'DepositRedeemed.ts',
          content: redeemedDepositDataStr
        })
      });
      
      if (!redeemedDepositResponse.ok) {
        throw new Error('Failed to save redeemed deposit data');
      }
    }

    // Save redeemed fund data if provided
    if (redeemedFundData) {
      const fundRedeemedDataStr = 'import { FundRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const FundRedeemedData: FundRedeemed_I[] = ' + 
        JSON.stringify(redeemedFundData, null, 2) + ';\n';

      const fundRedeemedResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'FundRedeemed.ts',
          content: fundRedeemedDataStr
        })
      });

      if (!fundRedeemedResponse.ok) {
        throw new Error('Failed to save redeemed fund data');
      }
    }

    // Save redeemed pension data if provided
    if (redeemedPensionData) {
      const pensionRedeemedDataStr = 'import { PensionRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const PensionRedeemedData: PensionRedeemed_I[] = ' +
        JSON.stringify(redeemedPensionData, null, 2) + ';\n';

      const pensionRedeemedResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'PensionRedeemed.ts',
          content: pensionRedeemedDataStr
        })
      });

      if (!pensionRedeemedResponse.ok) {
        throw new Error('Failed to save redeemed pension data');
      }
    }

    // Save redeemed stock data if provided
    if (redeemedStockData) {
      const stockRedeemedDataStr = 'import { StockRedeemed_I } from \'./dataTypes\';\n\n' +
        'export const StockRedeemedData: StockRedeemed_I[] = ' +
        JSON.stringify(redeemedStockData, null, 2) + ';\n'; 

      const stockRedeemedResponse = await fetch('http://localhost:3000/api/save-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: 'StockRedeemed.ts',
            content: stockRedeemedDataStr
          })
        });
      if (!stockRedeemedResponse.ok) {
        throw new Error('Failed to save redeemed stock data');
      }
    }

    // 计算并保存 app_totals
    const appTotals = calculateAppTotals(
      currentUSDData,
      currentRMBData || [],
      currentDepositData || [],
      currentFundData || [],
      currentPensionData || [],
      currentStockData || []
    );

    const appTotalsSaved = await saveAppTotals(selectedDate, appTotals);
    if (!appTotalsSaved) {
      throw new Error('Failed to save app totals');
    }

    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};
