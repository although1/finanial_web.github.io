import { 
  USDInvestmentDetail, 
  USDRedeemedInvestment,
  RMBInvestmentDetail,
  RMBRedeemedInvestment,
  DepositDetail,
  DepositRedeemed
} from '../data/dataTypes';

export const saveToFile = async (
  currentUSDData: USDInvestmentDetail[], 
  redeemedUSDData?: USDRedeemedInvestment[],
  currentRMBData?: RMBInvestmentDetail[],
  redeemedRMBData?: RMBRedeemedInvestment[],
  currentDepositData?: DepositDetail[],
  DepositRedeemedData?: DepositRedeemed[]
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
  RMBRedeemedData: RMBRedeemedInvestment[] 
} => {
  try {
    const currentDataStr = localStorage.getItem('USDInvestmentData');
    const redeemedDataStr = localStorage.getItem('USDRedeemedInvestmentData');
    const rmbDataStr = localStorage.getItem('RMBInvestmentData');
    const redeemedRmbDataStr = localStorage.getItem('RMBRedeemedInvestments');
    
    return {
      currentData: currentDataStr ? JSON.parse(currentDataStr) : [],
      redeemedData: redeemedDataStr ? JSON.parse(redeemedDataStr) : [],
      rmbData: rmbDataStr ? JSON.parse(rmbDataStr) : [],
      RMBRedeemedData: redeemedRmbDataStr ? JSON.parse(redeemedRmbDataStr) : []
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return { currentData: [], redeemedData: [], rmbData: [], RMBRedeemedData: [] };
  }
};
