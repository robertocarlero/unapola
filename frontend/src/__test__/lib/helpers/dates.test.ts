import { formatDate } from '@/lib/helpers/dates';

const date = new Date(2025, 3, 12);

describe('formatDate', () => {
  it('should format a date', () => {
    const expected = 'sáb, 12 abr 2025';

    const formattedDate = formatDate(date);

    expect(formattedDate).toBe(expected);
  });

  it('should format a date with a custom format', () => {
    const expected = 'sábado, 12 de abril de 2025';

    const formattedDate = formatDate(date, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    expect(formattedDate).toBe(expected);
  });
});
