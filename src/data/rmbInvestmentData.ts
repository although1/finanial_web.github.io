import { RMBInvestmentDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const rmbInvestmentData: RMBInvestmentDetail[] = [
  {
    app: "招商银行",
    type: "理财/人民币理财",
    name: "季季宝",
    initialRMB: 20000.00,
    purchaseDate: "2024/09/06",
    currentRMB: 20273.86,
    profit: 273.86
  },
  {
    app: "网商银行",
    type: "理财/人民币理财",
    name: "徽银理财",
    initialRMB: 20000.00,
    purchaseDate: "2025/05/09",
    currentRMB: 20000.00,
    profit: 0.00
  },
  {
    app: "网商银行",
    type: "理财/人民币理财",
    name: "平安理财",
    initialRMB: 50000.00,
    purchaseDate: "2025/04/18",
    currentRMB: 50057.86,
    profit: 57.86
  }
];
