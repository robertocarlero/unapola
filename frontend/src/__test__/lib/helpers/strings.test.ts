import { normalizeString } from '@/lib/helpers/strings';

describe('normalizeString', () => {
  it('should normalize a string', () => {
    const normalizedString = normalizeString('Hello World');

    expect(normalizedString).toBe('hello-world');
  });
});
