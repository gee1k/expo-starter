/**
 * 存储服务的通用接口
 */
export interface StorageService {
  // 基本方法
  setItem: (key: string, value: string) => Promise<boolean>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<boolean>;
  clear: () => Promise<boolean>;

  // 扩展方法
  setObject: <T>(key: string, value: T) => Promise<boolean>;
  getObject: <T>(key: string) => Promise<T | null>;
  multiSet: (keyValuePairs: [string, string][]) => Promise<boolean>;
  multiGet: (keys: string[]) => Promise<[string, string | null][]>;
  getAllKeys: () => Promise<string[]>;
}
