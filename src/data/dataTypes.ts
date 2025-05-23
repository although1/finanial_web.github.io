// 基础数据结构定义

/** 详细分类数据接口 */
export interface DetailData {
  [category: string]: number;  // 每个分类对应的金额
}

/** 机构数据接口 */
export interface InstitutionData {
  detail: DetailData;         // 该机构下的详细分类数据
  total: number;             // 该机构的总金额
  total_profit?: number;     // 该机构的总收益(可选)
}

/** 机构名称类型 */
type InstitutionKeys = string;

/** 完整的财务数据结构 */
export type FinancialData = Record<InstitutionKeys, InstitutionData> & {
  grand_total: number;         // 所有机构的总金额
  grand_total_profit?: number; // 所有机构的总收益(可选)
}

/** 时间序列数据点 */
export interface TimeSeriesPoint {
  date: string;              // 日期
  value: number;            // 数值
  profit: number;           // 收益
}

/** 分类数据结构 */
export interface CategoryData {
  name: string;             // 分类名称
  value: number;            // 分类金额
}

/** 详细分类数据结构 */
export interface DetailedCategoryData {
  institution: string;      // 机构名称
  categories: {             // 该机构下的分类数据
    name: string;          // 分类名称
    value: number;         // 分类金额
  }[];
}

/** 储蓄数据接口 */
interface SavingsData {
  yearToDateSavings: number;     // 当年已攒钱数
  yearSavingsTarget: number;     // 年度目标攒钱数
  averageMonthlySavings: number; // 月均攒钱数
  monthsPassed: number;          // 已过去的月份数
}

/** 处理后的完整数据结构 */
export interface ProcessedData {
  rawData: Array<{ data: FinancialData; date: string }>;  // 原始数据数组
  timeSeriesData: TimeSeriesPoint[];                      // 时间序列数据
  latestData: FinancialData;                             // 最新数据
  dates: string[];                                       // 日期列表
  yearToDateProfit: number;                             // 年至今收益
  annualizedReturn: number;                             // 年化收益率
  savingsData: SavingsData;                            // 储蓄数据
}

/**
 * 美元投资基本信息接口
 */
export interface USDDetail {
  app: string;                 // 对应APP
  name: string;                // 产品名称
  initialUSD: number;          // 美元本金
  buyRate: number;              // 购汇价
  initialRMB: number;          // 初始投资金额（人民币）
  purchaseDate: string;        // 购买日期
  currentUSD: number;          // 当前市值（美元）
  currentRate: number;          // 结汇价
  currentRMB: number;          // 当前市值（人民币）
  profit: number;              // 当前收益（人民币）
}

export interface USDDetailWithDates extends USDDetail {
  holdingDays: number;         // 持有天数
  annualizedReturn: number;    // 年化收益率
}

export interface USDRedeemed_I extends USDDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalUSD: number;            // 赎回时的金额（美元）
  finalRate: number;           // 赎回时的汇率  
  finalRMB: number;            // 赎回时的金额（人民币）
  finalProfit: number;         // 最终收益（人民币）
}

/**
 * 人民币投资基本信息接口
 */
export interface RMBDetail {
  app: string;                  // 对应APP
  name: string;                 // 产品名称
  initialRMB: number;          // 初始投资金额（人民币）
  purchaseDate: string;        // 购买日期
  currentRMB: number;          // 当前市值（人民币）
  profit: number;              // 当前收益
}

/**
 * 包含持有时间信息的人民币投资接口
 */
export interface RMBDetailWithDates extends RMBDetail {
  holdingDays: number;         // 持有天数
  annualizedReturn: number;    // 年化收益率
}

/**
 * 已赎回的人民币投资接口
 */
export interface RMBRedeemed_I extends RMBDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalRMB: number;            // 赎回时的金额（人民币）
  finalProfit: number;         // 最终收益
}

/**
 * 基金投资基本信息接口
 */
export interface FundDetail {
  app: string;                  // 对应APP
  name: string;                 // 产品名称
  initialFund: number;         // 初始投资金额（人民币）
  currentFund: number;         // 当前市值（人民币）
  profit: number;              // 当前收益
}

/**
 * 包含持有时间信息的基金投资接口
 */
export interface FundDetailWithDates extends FundDetail {
}

/**
 * 已赎回的基金投资接口
 */
export interface FundRedeemed_I extends FundDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalFund: number;           // 赎回时的金额（人民币）
  finalProfit: number;         // 最终收益
}

/**
 * 定期存款基本信息接口
 */
export interface DepositDetail {
  app: string;                 // 存款银行/平台名称
  name: string;                // 存款产品名称
  currentRMB: number;          // 当前金额（人民币）
}

export interface DepositDetailWithDates extends DepositDetail {
  holdingDays: number;         // 持有天数
}
export interface DepositRedeemed_I extends DepositDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalRMB: number;            // 赎回时的金额（人民币）
}

/**
 * 养老金基本信息接口
 */
export interface PensionDetail {
  app: string;                 // 平台名称
  name: string;                // 养老金产品名称
  currentRMB: number;          // 当前金额（人民币）
}

export interface PensionDetailWithDates extends PensionDetail {
  holdingDays: number;         // 持有天数
}
export interface PensionRedeemed_I extends PensionDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalRMB: number;            // 赎回时的金额（人民币）
}

/**
 * 股票投资基本信息接口
 */
export interface StockDetail {
  app: string;                  // 对应APP
  name: string;                 // 产品名称
  initialStock: number;         // 初始投资金额（人民币）
  currentStock: number;         // 当前市值（人民币）
  profit: number;              // 当前收益
}

/**
 * 包含持有时间信息的基金投资接口
 */
export interface StockDetailWithDates extends StockDetail {
}

/**
 * 已赎回的基金投资接口
 */
export interface StockRedeemed_I extends StockDetailWithDates {
  redeemDate: string;          // 赎回日期
  finalStock: number;            // 赎回时的金额（人民币）
  finalProfit: number;         // 最终收益
}

/** 机构总计表格数据结构 */
export interface InstitutionTotalTableRow {
  date: string;                 // 日期
  支付宝: number;               // 支付宝总计
  网商银行: number;             // 网商银行总计
  工行银行: number;             // 工行银行总计
  腾讯自选股: number;           // 腾讯自选股总计
  招商银行: number;             // 招商银行总计
  总计: number;                 // 总资产
}