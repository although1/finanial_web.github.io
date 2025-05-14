// 系统当前日期
export const SYSTEM_DATE = "2025/05/14";

// 验证日期是否超出系统当前日期
export const isValidDate = (dateStr: string): boolean => {
  const systemDate = new Date(SYSTEM_DATE);
  const selectedDate = new Date(dateStr.split('-').join('/'));
  return selectedDate <= systemDate;
};
