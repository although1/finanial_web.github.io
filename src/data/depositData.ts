import { DepositDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const depositInvestmentData: DepositDetail[] = [
  {
    app: "支付宝",
    name: "余额",
    currentRMB: 97.50,
  },
  {
    app: "支付宝",
    name: "余利宝",
    currentRMB: 5064.11,
  },
  {
    app: "工商银行",
    name: "存款",
    currentRMB: 3273.69,
  }
];
