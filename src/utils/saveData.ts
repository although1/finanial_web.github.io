import { USDInvestmentDetail } from '../data/dataTypes';
import { RedeemedInvestment } from '../data/dataTypes';

export const saveToFile = async (
  currentData: USDInvestmentDetail[], 
  redeemedData: RedeemedInvestment[] | undefined = undefined
): Promise<boolean> => {
  try {
    // 将当前投资数据格式化为字符串
    const currentDataStr = 'import { USDInvestmentDetail } from \'./dataTypes\';\n' +
      'import { SYSTEM_DATE } from \'../utils/dateUtils\';\n\n' +
      'export const DEFAULT_DATE = SYSTEM_DATE;\n\n' +
      'export const usdInvestmentData: USDInvestmentDetail[] = ' + 
      JSON.stringify(currentData, null, 2) + ';\n';

    // 使用 Fetch API 发送数据到服务器
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
      throw new Error(errorData.error || 'Failed to save current investment data');
    }

    // 如果有已赎回的数据，也保存它
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
        throw new Error(errorData.error || 'Failed to save redeemed investment data');
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
  redeemedData: RedeemedInvestment[] 
} => {
  try {
    const currentDataStr = localStorage.getItem('usdInvestmentData');
    const redeemedDataStr = localStorage.getItem('redeemedInvestments');
    
    return {
      currentData: currentDataStr ? JSON.parse(currentDataStr) : [],
      redeemedData: redeemedDataStr ? JSON.parse(redeemedDataStr) : []
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return { currentData: [], redeemedData: [] };
  }
};
