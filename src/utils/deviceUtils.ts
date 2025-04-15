// Utility functions for device detection

/**
 * Check if the current device is running iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Check if the current device is running Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Check if the current device is a mobile device
 */
export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

/**
 * Get the current device platform name
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'web';
};
