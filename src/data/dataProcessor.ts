import { FinancialData, ProcessedData, TimeSeriesPoint } from './dataTypes';

const MONTHLY_SAVINGS_TARGET = 12500; // 每月攒钱目标金额

/**
 * Process financial data from multiple sources
 * @param dataArray Array of financial data objects with dates
 * @returns Processed data for visualization
 */
export const processFinancialData = (
  dataArray: { data: FinancialData; date: string }[]
): ProcessedData => {
  // 按日期排序
  const sortedData = [...dataArray].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 获取时间序列数据
  const timeSeriesData: TimeSeriesPoint[] = sortedData.map((item) => ({
    date: item.date,
    value: item.data.grand_total as number,
    profit: item.data.grand_total_profit as number,
  }));

  // 获取最新月份和最新月份1号的数据
  const latestDate = new Date(sortedData[sortedData.length - 1].date);
  const latestMonth = latestDate.getMonth();
  const currentMonthFirstDay = sortedData
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === latestMonth && item.date.endsWith('-01');
    })
    .pop();

  // 如果找不到当月1号的数据，使用最新数据
  const latestData = currentMonthFirstDay?.data || sortedData[sortedData.length - 1].data;

  // 获取当年1月1号的数据
  const currentYear = latestDate.getFullYear();
  const januaryData = sortedData.find(item => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() === currentYear && 
           itemDate.getMonth() === 0 && 
           item.date.endsWith('-01');
  });

  // 使用月初数据计算收益
  const januaryDataTotal = januaryData?.data.grand_total || 0;
  const januaryProfit = januaryData?.data.grand_total_profit || 0;
  const currentMonthProfit = currentMonthFirstDay?.data.grand_total_profit || latestData.grand_total_profit || 0;
  const yearToDateProfit = currentMonthProfit - januaryProfit;

  // 计算月数和年化收益率
  const monthsPassed = latestDate.getMonth();
  const annualizedReturn = januaryDataTotal > 0 
    ? (yearToDateProfit / januaryDataTotal * (12 / monthsPassed) * 100)
    : 0;

  // 计算攒钱相关数据（只使用月初数据）
  const currentMonthTotal = currentMonthFirstDay?.data.grand_total || latestData.grand_total;
  const yearToDateSavings = currentMonthTotal - januaryDataTotal;
  const averageMonthlySavings = yearToDateSavings / monthsPassed;

  return {
    latestData,
    timeSeriesData,
    yearToDateProfit,
    annualizedReturn,
    savingsData: {
      yearToDateSavings,
      yearSavingsTarget: MONTHLY_SAVINGS_TARGET * 12,
      averageMonthlySavings,
      monthsPassed
    },
    rawData: sortedData,
    dates: sortedData.map(item => item.date)
  };
};

/**
 * Generate a color scale for institutions
 * @param institutions Array of institution names
 * @returns Object mapping institution names to colors
 */
export const generateColorMap = (institutions: string[]): Record<string, string> => {
  // Predefined color palette
  const colorPalette = [
    '#4299E1', // blue-500
    '#38B2AC', // teal-500
    '#ED8936', // orange-500
    '#667EEA', // indigo-500
    '#9F7AEA', // purple-500
    '#F56565', // red-500
    '#48BB78', // green-500
    '#ECC94B', // yellow-500
  ];

  const colorMap: Record<string, string> = {};
  
  institutions.forEach((institution, index) => {
    colorMap[institution] = colorPalette[index % colorPalette.length];
  });

  return colorMap;
};