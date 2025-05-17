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
  StockInvestmentDetail,
  StockRedeemed_I
} from '../data/dataTypes';

export const saveToFile = async (
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
  currentStockData?: StockInvestmentDetail[],
  redeemedStockData?: StockRedeemed_I[]
): Promise<boolean> => {
  try {
    // Save USD investment data
    const usdDataStr = 'import { USDDetailWithDates } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const USDData: USDDetailWithDates[] = ' + 
      JSON.stringify(currentUSDData, null, 2) + ';\n';

    const usdResponse = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'USD_Data.ts',
        content: usdDataStr
      })
    });

    if (!usdResponse.ok) {
      throw new Error('Failed to save USD investment data');
    }

    // Save RMB investment data if provided
    if (currentRMBData) {
      const rmbDataStr = 'import { RMBDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const RMBData: RMBDetail[] = ' + 
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
      const depositDataStr = 'import { DepositDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
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

    // 将基金数据保存逻辑移到外面，作为独立的条件判断
    if (currentFundData) {
      const fundDataStr = 'import { FundDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
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
      const pensionDataStr = 'import { PensionDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const PensionData: PensionDetail[] =' +
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
      const stockDataStr = 'import { StockInvestmentDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const StockData: StockInvestmentDetail[] = ' +
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

    // 添加赎回基金数据的保存逻辑
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

    // 添加赎回养老金数据的保存逻辑
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

    // 添加赎回股票数据的保存逻辑
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

    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    throw error;
  }
};
