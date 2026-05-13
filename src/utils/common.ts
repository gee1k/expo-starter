import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function withResolvers<T>() {
  let resolve: (value: T) => void = (value: T) => {};
  let reject: (reason?: any) => void = (reason?: any) => {};

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

export function debugLog(...args: any[]) {
  if (__DEV__) {
    console.log('[INFO]', ...args);
  }
}

export function debugError(...args: any[]) {
  if (__DEV__) {
    console.error('[ERROR]', ...args);
  }
}

export function debugWarn(...args: any[]) {
  if (__DEV__) {
    console.warn('[WARN]', ...args);
  }
}
