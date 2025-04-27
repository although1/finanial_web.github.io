import { FinancialData, ProcessedData, TimeSeriesPoint } from './dataTypes';

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
  }));

  // Get the latest data for distribution charts
  const latestData = sortedData[sortedData.length - 1].data;

  // Extract dates for reference
  const dates = sortedData.map((item) => item.date);

  // Return the processed data
  return {
    rawData: sortedData.map((item) => item.data),
    timeSeriesData,
    latestData,
    dates,
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