import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authClient } from '../auth';

// 通用接口返回数据结构
export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
}

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000, // 请求超时时间：30秒
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const cookie = authClient.getCookie();
    if (cookie) {
      config.headers.Cookie = cookie;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，可以在这里处理登出逻辑
          console.error('未授权，请重新登录');
          // 可以在这里触发退出登录或重定向到登录页面
          break;
        case 403:
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }

    // 可以在这里添加全局错误处理，如显示统一的错误提示
    // 例如使用 Toast 组件显示错误信息

    return Promise.reject(error);
  }
);

export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const { data: resData } = await http.request<ApiResponse<T>>(config);
    const { statusCode, message, data } = resData;
    if (statusCode < 200 || statusCode >= 400) {
      throw new Error(message || '请求失败');
    }
    return data;
  } catch (error: any) {
    console.error('请求错误:', error);
    if (error.response.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const requestRaw = async <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await http.request<T>(config);
    return response;
  } catch (error: any) {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
};

export default http;
