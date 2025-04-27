// Define types for the financial data structure

export interface DetailData {
  [category: string]: number;
}

export interface InstitutionData {
  detail: DetailData;
  total: number;
}

export interface FinancialData {
  [institution: string]: InstitutionData | number;
  grand_total: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
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