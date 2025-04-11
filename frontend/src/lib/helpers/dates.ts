import { Timestamp } from 'firebase/firestore';

/**
 * Format a date to a string
 * @param {Date | Timestamp | string} date - The date to format
 * @returns {string} The formatted date Martes 11, abril 2025
 */
export const formatDate = (date: Date | Timestamp | string) => {
  if (!date) return '';

  let newDate: Date = date as Date;

  if (typeof date === 'string') {
    newDate = new Date(date);
  }

  if (date instanceof Timestamp) {
    newDate = date.toDate();
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return newDate.toLocaleDateString('es-ES', options);
};
