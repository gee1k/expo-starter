import { expoClient } from '@better-auth/expo/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

/**
 * 跟随 BetterAuth 服务端的 user、session、account 配置的 additionalFields 保持一致
 * 保证在通过 BetterAuth 的 API 进行登录、注册、登出等操作时，能够正确的传递额外的字段
 */
const additionalFieldsPlugin = inferAdditionalFields({
  user: {
    role: {
      type: 'string',
      defaultValue: 'user',
      required: false,
    },
    clientId: {
      type: 'number',
      defaultValue: 1,
      required: true,
    },
    firstName: {
      type: 'string',
      defaultValue: '',
      required: false,
    },
    lastName: {
      type: 'string',
      defaultValue: '',
      required: false,
    },
    nickName: {
      type: 'string',
      required: false,
    },
    gender: {
      type: 'string',
      required: false,
    },
    birthYear: {
      type: 'string',
      required: false,
    },
    weight: {
      type: 'number',
      required: false,
    },
    height: {
      type: 'number',
      required: false,
    },
    displayUnit: {
      type: 'string',
      defaultValue: 'imperial',
      required: false,
    },
    maxHR: {
      type: 'number',
      required: false,
    },
    deviceId: {
      type: 'string',
      required: false,
    },
    timezone: {
      type: 'string',
      required: false,
    },
    weightClass: {
      type: 'string',
      required: false,
    },
    powerPunchThreshold: {
      type: 'number',
      required: false,
    },
  },
});

/**
 * BetterAuth client for Expo
 */
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  basePath: '/auth',
  plugins: [
    expoClient({
      scheme: 'expo-starter',
      storagePrefix: 'expo-starter',
      storage: SecureStore,
    }),
    additionalFieldsPlugin,
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthSessionUser = AuthSession['user'];
