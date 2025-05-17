// 系统当前日期 - 返回当前日期，格式为 YYYY/MM/DD
export const SYSTEM_DATE = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
})();

// 验证日期是否超出系统当前日期
export const isValidDate = (dateStr: string): boolean => {
  const systemDate = new Date(SYSTEM_DATE);
  const selectedDate = new Date(dateStr.split('-').join('/'));
  return selectedDate <= systemDate;
};
