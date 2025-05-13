import { USDInvestmentDetail } from '../data/dataTypes';

export const saveToFile = async (data: USDInvestmentDetail[]) => {
  try {
    const content = `import { USDInvestmentDetail } from './dataTypes';

export const usdInvestmentData: USDInvestmentDetail[] = ${JSON.stringify(data, null, 2)};
`;
    
    // 使用 Fetch API 发送数据到服务器
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath: 'src/data/usdInvestmentData.ts',
        content
      }),
    });

    if (!response.ok) {
      throw new Error('保存失败');
    }

    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
};
