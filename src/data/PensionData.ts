import { PensionDetail } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const PensionInvestmentData: PensionDetail[] = [
  {
    app: "支付宝",
    name: "养老金",
    currentRMB: 3120.00,
  },
  {
    app: "招商银行",
    name: "个人养老金",
    currentRMB: 12002.29,
  }
];
