import { 
  USDInvestmentDetail, 
  RedeemedInvestment,
  RMBInvestmentDetail,
  RedeemedRMBInvestment
} from '../data/dataTypes';

export const saveToFile = async (
  currentData: USDInvestmentDetail[], 
  redeemedData: RedeemedInvestment[] | undefined = undefined,
  rmbData: RMBInvestmentDetail[] | undefined = undefined,
  redeemedRmbData: RedeemedRMBInvestment[] | undefined = undefined
): Promise<boolean> => {
  try {
    // 将当前USD投资数据格式化为字符串
    const currentDataStr = 'import { USDInvestmentDetail } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const usdInvestmentData: USDInvestmentDetail[] = ' + 
      JSON.stringify(currentData, null, 2) + ';\n';

    // 保存USD投资数据
    const currentResponse = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: 'usdInvestmentData.ts',
        content: currentDataStr
      })
    });

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(errorData.error || 'Failed to save USD investment data');
    }

    // 如果有已赎回的USD数据，也保存它
    if (redeemedData) {
      const redeemedDataStr = 'import { RedeemedInvestment } from \'./dataTypes\';\n\n' +
        'export const redeemedInvestmentData: RedeemedInvestment[] = ' + 
        JSON.stringify(redeemedData, null, 2) + ';\n';

      const redeemedResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'redeemedInvestments.ts',
          content: redeemedDataStr
        })
      });

      if (!redeemedResponse.ok) {
        const errorData = await redeemedResponse.json();
        throw new Error(errorData.error || 'Failed to save redeemed USD investment data');
      }
    }

    // 如果有RMB投资数据，保存它
    if (rmbData) {
      const rmbDataStr = 'import { RMBInvestmentDetail } from \'./dataTypes\';\n' +
        'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
        'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
        'export const rmbInvestmentData: RMBInvestmentDetail[] = ' + 
        JSON.stringify(rmbData, null, 2) + ';\n';

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
        const errorData = await rmbResponse.json();
        throw new Error(errorData.error || 'Failed to save RMB investment data');
      }
    }

    // 如果有已赎回的RMB数据，保存它
    if (redeemedRmbData) {
      const redeemedRmbDataStr = 'import { RedeemedRMBInvestment } from \'./dataTypes\';\n\n' +
        'export const redeemedRmbInvestmentData: RedeemedRMBInvestment[] = ' + 
        JSON.stringify(redeemedRmbData, null, 2) + ';\n';

      const redeemedRmbResponse = await fetch('http://localhost:3000/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'redeemedRmbInvestments.ts',
          content: redeemedRmbDataStr
        })
      });

      if (!redeemedRmbResponse.ok) {
        const errorData = await redeemedRmbResponse.json();
        throw new Error(errorData.error || 'Failed to save redeemed RMB investment data');
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    throw error; // 重新抛出错误，让调用者能够处理它
  }
};

export const loadData = (): { 
  currentData: USDInvestmentDetail[], 
  redeemedData: RedeemedInvestment[], 
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
