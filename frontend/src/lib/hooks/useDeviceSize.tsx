import { useEffect, useState } from 'react';

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
        isSmall: window.innerWidth < 768,
        isMedium: window.innerWidth >= 768 && window.innerWidth < 1024,
        isLarge: window.innerWidth >= 1024 && window.innerWidth < 1440,
        isExtraLarge: window.innerWidth >= 1440,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
