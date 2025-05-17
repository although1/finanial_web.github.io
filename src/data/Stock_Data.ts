import { StockInvestmentDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const StockData: StockInvestmentDetail[] = [
  {
    "app": "腾讯自选股",
    "name": "股票",
    "initialStock": 26000,
    "purchaseDate": "2024/09/06",
    "currentStock": 26912.33,
    "profit": 912.33
  }
];
