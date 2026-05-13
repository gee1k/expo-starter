import { asyncStorage } from './async-storage';
import { secureStorage } from './secure-storage';

export * from './async-storage';
export * from './secure-storage';
export * from './types';

/**
 * 存储服务工厂函数，根据存储类型返回对应的存储服务
 */
export const storage = {
  /**
   * 获取异步存储服务，用于非敏感数据
   */
  async: asyncStorage,

  /**
   * 获取安全存储服务，用于敏感数据
   */
  secure: secureStorage,
};

export default storage;
