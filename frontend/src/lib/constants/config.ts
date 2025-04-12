export const FIREBASE_CONFIG = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

export const BREAKPOINTS = {
  small: 768,
  medium: 1024,
  large: 1440,
  extraLarge: 1440,
};
