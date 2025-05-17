import { 
  USDInvestmentDetail, 
  USDRedeemedInvestment,
  RMBInvestmentDetail,
  RMBRedeemedInvestment,
  DepositDetail,
  DepositRedeemed,
  FundInvestmentDetail,
  FundRedeemedInvestment,
  PensionDetail,
  PensionRedeemed,
  StockInvestmentDetail,
  StockRedeemedInvestment
} from '../data/dataTypes';

export const saveToFile = async (
  currentUSDData: USDInvestmentDetail[], 
  redeemedUSDData?: USDRedeemedInvestment[],
  currentRMBData?: RMBInvestmentDetail[],
  redeemedRMBData?: RMBRedeemedInvestment[],
  currentDepositData?: DepositDetail[],
  redeemedDepositData?: DepositRedeemed[],
  currentFundData?: FundInvestmentDetail[],
  redeemedFundData?: FundRedeemedInvestment[],
  currentPensionData?: PensionDetail[],
  redeemedPensionData?: PensionRedeemed[],
  currentStockData?: StockInvestmentDetail[],
  redeemedStockData?: StockRedeemedInvestment[]
): Promise<boolean> => {
  try {
    // Save USD investment data
    const usdDataStr = 'import { USDInvestmentDetailWithDates } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const USDData: USDInvestmentDetailWithDates[] = ' + 
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
      const rmbDataStr = 'import { RMBInvestmentDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const RMBData: RMBInvestmentDetail[] = ' + 
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
      const fundDataStr = 'import { FundInvestmentDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const FundData: FundInvestmentDetail[] = ' + 
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
      const redeemedUSDDataStr = 'import { USDRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const USDRedeemedData: USDRedeemedInvestment[] = ' + 
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
      const redeemedRMBDataStr = 'import { RMBRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const RMBRedeemedData: RMBRedeemedInvestment[] = ' + 
        JSON.stringify(redeemedRMBData, null, 2) + ';\n';

      const redeemedRMBResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'RMBRedeemedInvestments.ts',
          content: redeemedRMBDataStr
        })
      });

      if (!redeemedRMBResponse.ok) {
        throw new Error('Failed to save redeemed RMB investment data');
      }
    }

    // Save redeemed deposit data if provided
    if (redeemedDepositData) {
      const redeemedDepositDataStr = 'import { DepositRedeemed } from \'./dataTypes\';\n\n' +
        'export const DepositRedeemedData: DepositRedeemed[] = ' + 
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
      const fundRedeemedDataStr = 'import { FundRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const FundRedeemedData: FundRedeemedInvestment[] = ' + 
        JSON.stringify(redeemedFundData, null, 2) + ';\n';

      const fundRedeemedResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'FundRedeemedInvestments.ts',
          content: fundRedeemedDataStr
        })
      });

      if (!fundRedeemedResponse.ok) {
        throw new Error('Failed to save redeemed fund data');
      }
    }

    // 添加赎回养老金数据的保存逻辑
    if (redeemedPensionData) {
      const pensionRedeemedDataStr = 'import { PensionRedeemed } from \'./dataTypes\';\n\n' +
        'export const PensionRedeemedData: PensionRedeemed[] = ' +
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
      const stockRedeemedDataStr = 'import { StockRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const StockRedeemedData: StockRedeemedInvestment[] = ' +
        JSON.stringify(redeemedStockData, null, 2) + ';\n'; 

      const stockRedeemedResponse = await fetch('http://localhost:3000/api/save-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: 'StockRedeemedInvestments.ts',
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
