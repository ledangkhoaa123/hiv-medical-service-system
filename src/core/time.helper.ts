import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Chuyển dateString + timeString thành Date đúng giờ Việt Nam
 * @param dateString - 'YYYY-MM-DD'
 * @param timeString - 'HH:mm'
 * @returns Date object (UTC nhưng đại diện cho giờ GMT+7)
 */
export function parseVietnamTime(dateString: string, timeString: string): Date {
  return dayjs.tz(`${dateString} ${timeString}`, 'YYYY-MM-DD HH:mm', 'Asia/Ho_Chi_Minh').toDate();
}
