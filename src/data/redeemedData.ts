import { USDInvestmentDetailWithDates } from './dataTypes';

export interface RedeemedInvestment extends USDInvestmentDetailWithDates {
    redeemDate: string;
    finalUSD: number;
    finalRate: number;
    finalRMB: number;
    finalProfit: number;
}

export const redeemedInvestments: RedeemedInvestment[] = [];
