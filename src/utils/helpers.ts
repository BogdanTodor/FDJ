/**
 * Utility Helper Functions
 * 
 * This file is optional but might be useful for common operations
 */

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const calculateDaysDifference = (date1: Date, date2: Date): number => {
  // Might be useful for completion time calculations
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isDateWithin24Hours = (date: Date): boolean => {
  // Useful for priority scoring bonus
  const now = new Date();
  const timeDiff = date.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  return hoursDiff <= 24 && hoursDiff > 0;
}; 