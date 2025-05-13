// Define types for the financial data structure

export interface DetailData {
  [category: string]: number;
}

export interface InstitutionData {
  detail: DetailData;
  total: number;
  total_profit?: number;
}

type InstitutionKeys = string;

export type FinancialData = Record<InstitutionKeys, InstitutionData> & {
  grand_total: number;
  grand_total_profit?: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  profit: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface DetailedCategoryData {
  institution: string;
  categories: {
    name: string;
    value: number;
  }[];
}

interface SavingsData {
  yearToDateSavings: number;     // 当年已攒钱数
  yearSavingsTarget: number;     // 年度目标攒钱数
  averageMonthlySavings: number; // 月均攒钱数
  monthsPassed: number;          // 已过去的月份数
}

export interface ProcessedData {
  rawData: Array<{ data: FinancialData; date: string }>;
  timeSeriesData: TimeSeriesPoint[];
  latestData: FinancialData;
  dates: string[];
  yearToDateProfit: number;
  annualizedReturn: number;
  savingsData: SavingsData;
}

export interface USDInvestmentDetail {
  app: string;                   // 对应APP
  type: string;                  // 理财类型
  name: string;                  // 理财名称
  initialUSD: number;           // 美元本金
  buyRate: number;              // 购汇价
  initialRMB: number;           // 购汇RMB价格
  purchaseDate: string;         // 购买时间
  currentUSD: number;           // 当前美元数额
  currentRate: number;          // 结汇价
  currentRMB: number;           // 当前RMB数额
  profit: number;               // 实际收益
  date: string;                 // 日期
  holdingDays: number;          // 持有天数
  annualizedReturn: number;     // 对应的年化率
}