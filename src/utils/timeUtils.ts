
export const timeStringToTimestamp = (timeString: string, dayOfWeek: number): string => {
  // Create a date for the next occurrence of the specified day of week
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntilTarget);
  
  // Parse the time string (e.g., "07:55")
  const [hours, minutes] = timeString.split(':').map(Number);
  targetDate.setHours(hours, minutes, 0, 0);
  
  return targetDate.toISOString();
};

export const timestampToTimeString = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatTimeForDisplay = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
