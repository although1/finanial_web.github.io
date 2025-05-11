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
  // Sort data by date
  const sortedData = [...dataArray].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Extract time series data for trend chart
  const timeSeriesData: TimeSeriesPoint[] = sortedData.map((item) => ({
    date: item.date,
    value: item.data.grand_total as number,
    profit: item.data.grand_total_profit as number,
  }));

  // Get the latest data point
  const latestDataPoint = sortedData[sortedData.length - 1];
  const latestData = latestDataPoint.data;

  // Extract dates for reference
  const dates = sortedData.map((item) => item.date);

  // Calculate year-to-date profit and annualized return
  const currentYear = new Date(latestDataPoint.date).getFullYear();
  const januaryData = sortedData.find(item => 
    new Date(item.date).getFullYear() === currentYear && 
    new Date(item.date).getMonth() === 0
  );

  const yearToDateProfit = januaryData 
    ? (latestData.grand_total_profit || 0) - (januaryData.data.grand_total_profit || 0)
    : (latestData.grand_total_profit || 0);

  // Calculate months elapsed (if starting from January, current month + 1)
  const currentDate = new Date(latestDataPoint.date);
  const monthsElapsed = currentDate.getMonth() + 1;
  
  // Calculate annualized return rate
  const januaryTotal = januaryData ? januaryData.data.grand_total : 0;
  const annualizedReturn = januaryTotal > 0 
    ? (yearToDateProfit / januaryTotal * (12 / monthsElapsed) * 100)
    : 0;

  // 计算攒钱相关指标
  const currentYearData = sortedData.filter(item => item.date.startsWith('2025'));
  const januaryDataTotal = currentYearData[0]?.data.grand_total || 0;
  const latestTotal = latestData.grand_total;
  const yearToDateSavings = latestTotal - januaryDataTotal;
  const monthsPassed = new Date().getMonth() + 1;
  const yearSavingsTarget = MONTHLY_SAVINGS_TARGET * 12;
  const averageMonthlySavings = yearToDateSavings / monthsPassed;

  // Return the processed data
  return {
    rawData: sortedData.map(item => item.data),
    timeSeriesData,
    latestData,
    dates,
    yearToDateProfit,
    annualizedReturn,
    savingsData: {
      yearToDateSavings,
      yearSavingsTarget,
      averageMonthlySavings,
      monthsPassed
    }
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