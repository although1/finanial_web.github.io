import { FundDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const FundData: FundDetail[] = [
  {
    "app": "支付宝",
    "name": "基金",
    "initialFund": 18434.59,
    "purchaseDate": "2024/09/06",
    "currentFund": 18212.75,
    "profit": -221.84
  },
  {
    "app": "工商银行",
    "name": "基金1",
    "initialFund": 30000,
    "purchaseDate": "2024/09/06",
    "currentFund": 30120.51,
    "profit": 120.51
  }
];
