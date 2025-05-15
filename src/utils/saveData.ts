import { 
  USDInvestmentDetail, 
  USDRedeemedInvestment,
  RMBInvestmentDetail,
  RedeemedRMBInvestment,
  DepositDetail,
  RedeemedDeposit
} from '../data/dataTypes';

export const saveToFile = async (
  currentUSDData: USDInvestmentDetail[], 
  currentRMBData?: RMBInvestmentDetail[],
  currentDepositData?: DepositDetail[],
  redeemedUSDData?: USDRedeemedInvestment[],
  redeemedRMBData?: RedeemedRMBInvestment[],
  redeemedDepositData?: RedeemedDeposit[]
): Promise<boolean> => {
  try {
    // Save USD investment data
    const usdDataStr = 'import { USDInvestmentDetail } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const usdInvestmentData: USDInvestmentDetail[] = ' + 
      JSON.stringify(currentUSDData, null, 2) + ';\n';

    const usdResponse = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'usdInvestmentData.ts',
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
        'export const rmbInvestmentData: RMBInvestmentDetail[] = ' + 
        JSON.stringify(currentRMBData, null, 2) + ';\n';

      const rmbResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'rmbInvestmentData.ts',
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
        'export const redeemedInvestmentData: USDRedeemedInvestment[] = ' + 
        JSON.stringify(redeemedUSDData, null, 2) + ';\n';

      const redeemedUSDResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'redeemedInvestments.ts',
          content: redeemedUSDDataStr
        })
      });

      if (!redeemedUSDResponse.ok) {
        throw new Error('Failed to save redeemed USD investment data');
      }
    }

    // Save redeemed RMB data if provided
    if (redeemedRMBData) {
      const redeemedRMBDataStr = 'import { RedeemedRMBInvestment } from \'./dataTypes\';\n\n' +
        'export const redeemedRmbInvestmentData: RedeemedRMBInvestment[] = ' + 
        JSON.stringify(redeemedRMBData, null, 2) + ';\n';

      const redeemedRMBResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'redeemedRmbInvestments.ts',
          content: redeemedRMBDataStr
        })
      });

      if (!redeemedRMBResponse.ok) {
        throw new Error('Failed to save redeemed RMB investment data');
      }
    }

    // Save redeemed deposit data if provided
    if (redeemedDepositData) {
      const redeemedDepositDataStr = 'import { RedeemedDeposit } from \'./dataTypes\';\n\n' +
        'export const redeemedDepositData: RedeemedDeposit[] = ' + 
        JSON.stringify(redeemedDepositData, null, 2) + ';\n';

      const redeemedDepositResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'redeemedDeposits.ts',
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
  redeemedRmbData: RedeemedRMBInvestment[] 
} => {
  try {
    const currentDataStr = localStorage.getItem('usdInvestmentData');
    const redeemedDataStr = localStorage.getItem('redeemedInvestments');
    const rmbDataStr = localStorage.getItem('rmbInvestmentData');
    const redeemedRmbDataStr = localStorage.getItem('redeemedRmbInvestments');
    
    return {
      currentData: currentDataStr ? JSON.parse(currentDataStr) : [],
      redeemedData: redeemedDataStr ? JSON.parse(redeemedDataStr) : [],
      rmbData: rmbDataStr ? JSON.parse(rmbDataStr) : [],
      redeemedRmbData: redeemedRmbDataStr ? JSON.parse(redeemedRmbDataStr) : []
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return { currentData: [], redeemedData: [], rmbData: [], redeemedRmbData: [] };
  }
};
