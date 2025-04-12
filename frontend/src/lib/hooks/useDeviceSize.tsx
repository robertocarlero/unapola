import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '../constants/config';

/**
 * Hook to get the device size
 * @returns An object with the device size
 *
 * @example
 * const { isSmall, isMedium, isLarge, isExtraLarge } = useDeviceSize();
 * console.log(isSmall, isMedium, isLarge, isExtraLarge);
 *
 * Response:
 * {
 *   isSmall: false,
 *   isMedium: false,
 *   isLarge: false,
 *   isExtraLarge: false,
 * }
 */
export const useDeviceSize = () => {
  const [size, setSize] = useState<{
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
    isExtraLarge: boolean;
  }>({
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isExtraLarge: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        isSmall: window.innerWidth < BREAKPOINTS.small,
        isMedium:
          window.innerWidth >= BREAKPOINTS.small &&
          window.innerWidth < BREAKPOINTS.medium,
        isLarge:
          window.innerWidth >= BREAKPOINTS.medium &&
          window.innerWidth < BREAKPOINTS.large,
        isExtraLarge: window.innerWidth >= BREAKPOINTS.large,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
