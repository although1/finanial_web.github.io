// src/data/convertJsonToMockData.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义数据类型（与 mockData.ts 一致）
type FinancialData = {
  [key: string]: {
    detail: { [category: string]: number };
    total: number;
    total_profit?: number;
    grand_total: number;
    grand_total_profit?: number;
  };
};

// 1. 读取 JSON 文件目录
const jsonDir = path.join(__dirname, '../data'); // 假设 JSON 文件存放在 public/data 目录
const jsonFiles = fs.readdirSync(jsonDir).filter(file => file.startsWith('app_totals_'));

// 2. 解析文件名中的日期并加载数据
const mockData = jsonFiles.map(file => {
  // 提取日期（如 '2025-04-23'）
  const date = file.match(/app_totals_(\d{4}-\d{2}-\d{2})\.json/)?.[1];
  if (!date) throw new Error(`Invalid filename: ${file}`);

  // 读取 JSON 内容
  const content = fs.readFileSync(path.join(jsonDir, file), 'utf-8');
  const data: FinancialData = JSON.parse(content);

  return { date, data };
});

// 3. 生成 TypeScript 代码模板
const tsCode = `import { FinancialData } from './dataTypes';

// These are sample data files based on the data provided
export const mockData: { data: FinancialData; date: string }[] = [
  ${mockData.map(item => `{
    date: '${item.date}',
    data: {
      ${Object.entries(item.data).map(([key, value]) => {
        if (key === 'grand_total') return `"${key}": ${value}`;
        if (key === 'grand_total_profit') return `"${key}": ${value}`;
        return `"${key}": {
          "detail": {
            ${Object.entries((value as any).detail).map(([k, v]) => `"${k}": ${v}`).join(',\n            ')}
          },
          "total": ${(value as any).total}${(value as any).total_profit !== undefined ? `,
          "total_profit": ${(value as any).total_profit}` : ''}
        }`;
      }).join(',\n      ')}
    }
  }`).join(',\n  ')}
];

// 可选：保留原有的随机生成逻辑（如果需要）
// ${fs.readFileSync(path.join(__dirname, 'mockData.ts'), 'utf-8').split('// Add more mock data')[1]}
`;

// 4. 写入到 mockData.ts
fs.writeFileSync(path.join(__dirname, 'mockData.ts'), tsCode);
console.log('🎉 mockData.ts 已更新！');