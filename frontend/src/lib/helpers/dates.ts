import { Timestamp } from 'firebase/firestore';

/**
 * Format a date to a string
 * @param date - The date to format
 * @param options - The options to format the date
 * @returns The formatted date in Spanish format.
 *
 * @example
 * const formattedDate = formatDate(new Date());
 * console.log(formattedDate);
 *
 * Response:
 * 'sáb, 12 abr 2025'
 */
export const formatDate = (
  date: Date | Timestamp | string | undefined,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!date) return '';

  let newDate: Date = date as Date;

  if (typeof date === 'string') {
    newDate = new Date(date);
  }

  if (date instanceof Timestamp) {
    newDate = date.toDate();
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return newDate.toLocaleDateString('es-ES', {
    ...defaultOptions,
    ...options,
  });
};
