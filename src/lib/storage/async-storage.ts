import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './types';

/**
 * AsyncStorage 服务配置选项
 */
export interface AsyncStorageOptions {
  /** 用于区分不同应用或模块的存储键前缀 */
  prefix?: string;
}

/**
 * 基于 @react-native-async-storage/async-storage 的存储服务
 * 用于存储非敏感数据如用户偏好、缓存等
 */
export class AsyncStorageService implements StorageService {
  private prefix: string;

  constructor(options: AsyncStorageOptions = {}) {
    this.prefix = options.prefix || 'expo_starter_';
  }

  /**
   * 构建带前缀的存储键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 存储键值对
   */
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.getKey(key), value);
      return true;
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      return false;
    }
  }

  /**
   * 获取存储的值
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  }

  /**
   * 移除存储的值
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      return false;
    }
  }

  /**
   * 清除所有存储
   */
  async clear(): Promise<boolean> {
    try {
      // 只清除带有指定前缀的项
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter((key) => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(keysToRemove);
      return true;
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      return false;
    }
  }

  /**
   * 存储对象
   */
  async setObject<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(this.getKey(key), jsonValue);
      return true;
    } catch (error) {
      console.error('AsyncStorage setObject error:', error);
      return false;
    }
  }

  /**
   * 获取存储的对象
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.getKey(key));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('AsyncStorage getObject error:', error);
      return null;
    }
  }

  /**
   * 获取所有存储的键
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.slice(this.prefix.length));
    } catch (error) {
      console.error('AsyncStorage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * 批量存储多个键值对
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<boolean> {
    try {
      const prefixedPairs = keyValuePairs.map(
        ([key, value]) => [this.getKey(key), value] as [string, string]
      );
      await AsyncStorage.multiSet(prefixedPairs);
      return true;
    } catch (error) {
      console.error('AsyncStorage multiSet error:', error);
      return false;
    }
  }

  /**
   * 批量获取多个键的值
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      const prefixedKeys = keys.map((key) => this.getKey(key));
      const results = await AsyncStorage.multiGet(prefixedKeys);
      return results.map(([key, value]) => [key.slice(this.prefix.length), value]);
    } catch (error) {
      console.error('AsyncStorage multiGet error:', error);
      return [];
    }
  }
}

// 导出默认实例
export const asyncStorage = new AsyncStorageService();
