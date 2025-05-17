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
  PensionRedeemed
} from '../data/dataTypes';

export const saveToFile = async (
  currentUSDData: USDInvestmentDetail[], 
  redeemedUSDData?: USDRedeemedInvestment[],
  currentRMBData?: RMBInvestmentDetail[],
  redeemedRMBData?: RMBRedeemedInvestment[],
  currentDepositData?: DepositDetail[],
  DepositRedeemedData?: DepositRedeemed[],
  currentFundData?: FundInvestmentDetail[],
  FundRedeemedData?: FundRedeemedInvestment[],
  currentPensionData?: PensionDetail[],
  PensionRedeemedData?: PensionRedeemed[]
): Promise<boolean> => {
  try {
    // Save USD investment data
    const usdDataStr = 'import { USDInvestmentDetail } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const USDInvestmentData: USDInvestmentDetail[] = ' + 
      JSON.stringify(currentUSDData, null, 2) + ';\n';

    const usdResponse = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'USDInvestmentData.ts',
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
        'export const RMBInvestmentData: RMBInvestmentDetail[] = ' + 
        JSON.stringify(currentRMBData, null, 2) + ';\n';

      const rmbResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'RMBInvestmentData.ts',
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
        'export const depositData: DepositDetail[] = ' + 
        JSON.stringify(currentDepositData, null, 2) + ';\n';

      const depositResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'depositData.ts',
          content: depositDataStr
        })
      });

      if (!depositResponse.ok) {
        throw new Error('Failed to save deposit data');
      }
    }

    // Save redeemed USD data if provided
    if (redeemedUSDData) {
      const redeemedUSDDataStr = 'import { USDRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const USDRedeemedInvestmentData: USDRedeemedInvestment[] = ' + 
        JSON.stringify(redeemedUSDData, null, 2) + ';\n';

      const redeemedUSDResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'USDRedeemedInvestments.ts',
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
        'export const RMBRedeemedInvestmentData: RMBRedeemedInvestment[] = ' + 
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
    if (DepositRedeemedData) {
      const redeemedDepositDataStr = 'import { DepositRedeemed } from \'./dataTypes\';\n\n' +
        'export const DepositRedeemedData: DepositRedeemed[] = ' + 
        JSON.stringify(DepositRedeemedData, null, 2) + ';\n';

      const redeemedDepositResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'DepositsRedeemed.ts',
          content: redeemedDepositDataStr
        })
      });
      
      if (!redeemedDepositResponse.ok) {
        throw new Error('Failed to save redeemed deposit data');
      }
    }

    // 将基金数据保存逻辑移到外面，作为独立的条件判断
    if (currentFundData) {
      const fundDataStr = 'import { FundInvestmentDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const FundInvestmentData: FundInvestmentDetail[] = ' + 
        JSON.stringify(currentFundData, null, 2) + ';\n';

      const fundResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'FundInvestmentData.ts',
          content: fundDataStr
        })
      });

      if (!fundResponse.ok) {
        throw new Error('Failed to save fund investment data');
      }
    }

    // 添加赎回基金数据的保存逻辑
    if (FundRedeemedData) {
      const fundRedeemedDataStr = 'import { FundRedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const FundRedeemedInvestmentData: FundRedeemedInvestment[] = ' + 
        JSON.stringify(FundRedeemedData, null, 2) + ';\n';

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
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    throw error;
  }
};

export const loadData = (): { 
  currentData: USDInvestmentDetail[], 
  redeemedData: USDRedeemedInvestment[], 
  rmbData: RMBInvestmentDetail[], 
  RMBRedeemedData: RMBRedeemedInvestment[],
  depositData: DepositDetail[],
  depositRedeemedData: DepositRedeemed[],
  fundData: FundInvestmentDetail[],
  fundRedeemedData: FundRedeemedInvestment[]
} => {
  try {
    const currentDataStr = localStorage.getItem('USDInvestmentData');
    const redeemedDataStr = localStorage.getItem('USDRedeemedInvestmentData');
    const rmbDataStr = localStorage.getItem('RMBInvestmentData');
    const redeemedRmbDataStr = localStorage.getItem('RMBRedeemedInvestments');
    const depositDataStr = localStorage.getItem('depositData');
    const depositRedeemedDataStr = localStorage.getItem('DepositsRedeemed');
    const fundDataStr = localStorage.getItem('FundInvestmentData');
    const fundRedeemedDataStr = localStorage.getItem('FundRedeemedInvestments');
    
    return {
      currentData: currentDataStr ? JSON.parse(currentDataStr) : [],
      redeemedData: redeemedDataStr ? JSON.parse(redeemedDataStr) : [],
      rmbData: rmbDataStr ? JSON.parse(rmbDataStr) : [],
      RMBRedeemedData: redeemedRmbDataStr ? JSON.parse(redeemedRmbDataStr) : [],
      depositData: depositDataStr ? JSON.parse(depositDataStr) : [],
      depositRedeemedData: depositRedeemedDataStr ? JSON.parse(depositRedeemedDataStr) : [],
      fundData: fundDataStr ? JSON.parse(fundDataStr) : [],
      fundRedeemedData: fundRedeemedDataStr ? JSON.parse(fundRedeemedDataStr) : []
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return { 
      currentData: [], 
      redeemedData: [], 
      rmbData: [], 
      RMBRedeemedData: [],
      depositData: [],
      depositRedeemedData: [],
      fundData: [],
      fundRedeemedData: []
    };
  }
};
