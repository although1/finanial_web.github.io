import { DepositDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const depositInvestmentData: DepositDetail[] = [
  {
    app: "支付宝",
    name: "余额",
    initialRMB: 97.50,
    purchaseDate: "2025/05/15",
    currentRMB: 97.50,
    profit: 0.00
  },
  {
    app: "支付宝",
    name: "余利宝",
    initialRMB: 5000.00,
    purchaseDate: "2025/05/15",
    currentRMB: 5064.11,
    profit: 64.11
  },
  {
    app: "工商银行",
    name: "存款",
    initialRMB: 3200.00,
    purchaseDate: "2025/05/15",
    currentRMB: 3273.69,
    profit: 73.69
  }
];
