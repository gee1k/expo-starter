import * as SecureStore from 'expo-secure-store';
import { StorageService } from './types';

/**
 * 安全存储服务配置选项
 */
export interface SecureStorageOptions {
  /** 用于区分不同应用或模块的存储键前缀 */
  prefix?: string;
  /** SecureStore 存储选项 */
  secureStoreOptions?: SecureStore.SecureStoreOptions;
}

/**
 * 基于 expo-secure-store 的安全存储服务
 * 用于存储敏感数据如认证令牌、用户凭据等
 */
export class SecureStorageService implements StorageService {
  private prefix: string;
  private options?: SecureStore.SecureStoreOptions;

  constructor(options: SecureStorageOptions = {}) {
    this.prefix = options.prefix || 'expo_starter_secure_';
    this.options = options.secureStoreOptions;
  }

  /**
   * 构建带前缀的存储键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 安全存储键值对
   */
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(this.getKey(key), value, this.options);
      return true;
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      return false;
    }
  }

  /**
   * 获取安全存储的值
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.getKey(key), this.options);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  /**
   * 移除安全存储的值
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.getKey(key), this.options);
      return true;
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      return false;
    }
  }

  /**
   * 清除所有安全存储
   * 注意: SecureStore 没有直接清除所有项的方法，此方法需要与getAllKeys配合使用
   */
  async clear(): Promise<boolean> {
    console.warn('SecureStorage clear: SecureStore does not support clearing all items directly.');
    return false;
  }

  /**
   * 存储对象（序列化为JSON）
   */
  async setObject<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await SecureStore.setItemAsync(this.getKey(key), jsonValue, this.options);
      return true;
    } catch (error) {
      console.error('SecureStorage setObject error:', error);
      return false;
    }
  }

  /**
   * 获取存储的对象
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await SecureStore.getItemAsync(this.getKey(key), this.options);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('SecureStorage getObject error:', error);
      return null;
    }
  }

  /**
   * 批量存储多个键值对
   * 注意：SecureStore没有原生的批量操作，这里是顺序执行多个操作
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<boolean> {
    try {
      await Promise.all(keyValuePairs.map(([key, value]) => this.setItem(key, value)));
      return true;
    } catch (error) {
      console.error('SecureStorage multiSet error:', error);
      return false;
    }
  }

  /**
   * 批量获取多个键的值
   * 注意：SecureStore没有原生的批量操作，这里是顺序执行多个操作
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      const results = await Promise.all(
        keys.map(async (key) => {
          const value = await this.getItem(key);
          return [key, value] as [string, string | null];
        })
      );
      return results;
    } catch (error) {
      console.error('SecureStorage multiGet error:', error);
      return [];
    }
  }

  /**
   * 获取所有键
   * 注意：SecureStore没有获取所有键的方法，这里返回空数组
   */
  async getAllKeys(): Promise<string[]> {
    console.warn('SecureStorage getAllKeys: SecureStore does not support getting all keys.');
    return [];
  }
}

// 导出默认实例
export const secureStorage = new SecureStorageService();
