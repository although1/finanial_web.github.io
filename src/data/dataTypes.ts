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

export interface ProcessedData {
  rawData: FinancialData[];
  timeSeriesData: TimeSeriesPoint[];
  latestData: FinancialData;
  dates: string[];
}