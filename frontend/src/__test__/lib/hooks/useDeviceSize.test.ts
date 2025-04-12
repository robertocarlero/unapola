import { renderHook } from '@testing-library/react';
import { useDeviceSize } from '@/lib/hooks/useDeviceSize';
import { BREAKPOINTS } from '@/lib/constants/config';

describe('useDeviceSize', () => {
  it('should return the correct result', () => {
    const { result } = renderHook(() => useDeviceSize());

    const { isSmall, isMedium, isLarge, isExtraLarge } = result.current;

    expect(isSmall).toBeDefined();
    expect(isMedium).toBeDefined();
    expect(isLarge).toBeDefined();
    expect(isExtraLarge).toBeDefined();
  });

  it('should return the correct result when the window is resized', () => {
    const { result } = renderHook(() => useDeviceSize());

    const { isSmall, isMedium, isLarge, isExtraLarge } = result.current;

    if (isSmall) {
      expect(window.innerWidth).toBeLessThan(BREAKPOINTS.small);
    }

    if (isMedium) {
      expect(window.innerWidth).toBeGreaterThanOrEqual(BREAKPOINTS.small);
      expect(window.innerWidth).toBeLessThan(BREAKPOINTS.medium);
    }

    if (isLarge) {
      expect(window.innerWidth).toBeGreaterThanOrEqual(BREAKPOINTS.medium);
      expect(window.innerWidth).toBeLessThan(BREAKPOINTS.large);
    }

    if (isExtraLarge) {
      expect(window.innerWidth).toBeGreaterThanOrEqual(BREAKPOINTS.large);
    }
  });
});
