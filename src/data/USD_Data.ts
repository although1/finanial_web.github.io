import { USDInvestmentDetailWithDates } from './dataTypes';
import { SYSTEM_DATE } from '../utils/dateUtils';

export const DEFAULT_DATE = SYSTEM_DATE;

export const USDData: USDInvestmentDetailWithDates[] = [
  {
    "app": "工商银行",
    "name": "高盛每日理财",
    "initialUSD": 10029.13,
    "buyRate": 720.8,
    "initialRMB": 72289.97,
    "purchaseDate": "2024/08/01",
    "currentUSD": 10338.39,
    "currentRate": 722.66,
    "currentRMB": 74711.41,
    "profit": 2421.44,
    "holdingDays": 289,
    "annualizedReturn": 423.05
  },
  {
    "app": "工商银行",
    "name": "高盛工银",
    "initialUSD": 52.78,
    "buyRate": 720.8,
    "initialRMB": 380.44,
    "purchaseDate": "2024/08/01",
    "currentUSD": 54.28,
    "currentRate": 722.66,
    "currentRMB": 392.26,
    "profit": 11.82,
    "holdingDays": 289,
    "annualizedReturn": 392.4
  },
  {
    "app": "工商银行",
    "name": "工银理财月月",
    "initialUSD": 2000,
    "buyRate": 724.6,
    "initialRMB": 14492,
    "purchaseDate": "2024/04/02",
    "currentUSD": 2049.12,
    "currentRate": 722.66,
    "currentRMB": 14808.17,
    "profit": 316.17,
    "holdingDays": 410,
    "annualizedReturn": 194.22
  },
  {
    "app": "工商银行",
    "name": "工银理财全球",
    "initialUSD": 52,
    "buyRate": 724.6,
    "initialRMB": 376.79,
    "purchaseDate": "2024/04/02",
    "currentUSD": 53.25,
    "currentRate": 722.66,
    "currentRMB": 384.82,
    "profit": 8.03,
    "holdingDays": 410,
    "annualizedReturn": 189.73
  },
  {
    "app": "招商银行",
    "name": "招银稳健型",
    "initialUSD": 1000,
    "buyRate": 715.05,
    "initialRMB": 7150.5,
    "purchaseDate": "2024/08/21",
    "currentUSD": 1028.83,
    "currentRate": 722.23,
    "currentRMB": 7430.52,
    "profit": 280.02,
    "holdingDays": 269,
    "annualizedReturn": 531.37
  },
  {
    "app": "招商银行",
    "name": "招银信用优选",
    "initialUSD": 2000,
    "buyRate": 715.97,
    "initialRMB": 14319.4,
    "purchaseDate": "2024/08/20",
    "currentUSD": 2060.13,
    "currentRate": 722.23,
    "currentRMB": 14878.88,
    "profit": 559.48,
    "holdingDays": 270,
    "annualizedReturn": 528.19
  }
];
