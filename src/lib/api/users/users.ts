import { MeasurementPreference } from '@/types';
import { request } from '../http';

export namespace UsersApi {
  export type UserRole = 'user' | 'admin';
  export type UserGender = 'male' | 'female';

  export type UserProfile = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: UserRole;
    clientId: number;
    firstName: string | null;
    lastName: string | null;
    nickName: string | null;
    gender: UserGender | null;
    birthYear: string | null;
    weight: number | null;
    height: number | null;
    displayUnit: MeasurementPreference;
    maxHR: number | null;
    deviceId: string | null;
    timezone: string | null;
    createdAt: string;
    updatedAt: string;
  };

  export type UserActivityParams = {
    startDate: string; // YYYY/MM/DD
    endDate: string; // YYYY/MM/DD
  };

  export type UserActivityResult = {
    date: string; // YYYY/MM/DD
    sessionCount: number;
  };

  export type MyLifetimeStats = {
    avgPower: number;
    sessionCount: number;
    totalPunches: number;
  };

  export type MyRankingParams = {
    days: number;
    gender: 'male' | 'female' | 'all';
    criteria: 'maxPower' | 'totalPunches';
  };

  export type MyRankingUser = {
    email: string;
    firstName: string;
    gender: UserGender;
    id: string;
    lastName: string;
    name: string;
    nickName: string;
    value: number;
  };

  export type MyRankingResult = {
    rank: number;
    user: MyRankingUser;
  };

  export type RankingListPrams = MyRankingParams & {
    page: number;
    pageSize: number;
  };

  export type RankingUser = MyRankingUser & {
    rank: number;
  };

  export type RankingListResult = {
    total: number;
    users: RankingUser[];
  };
}

export async function getUserProfile() {
  return request<UsersApi.UserProfile>({
    method: 'GET',
    url: '/users/profile',
  });
}

export async function updateUserProfile(data: Partial<UsersApi.UserProfile>) {
  return request<UsersApi.UserProfile>({
    method: 'PATCH',
    url: '/users/profile',
    data,
  });
}

export async function getUserActivity(params: UsersApi.UserActivityParams) {
  return request<UsersApi.UserActivityResult[]>({
    method: 'GET',
    url: '/users/activity',
    params,
  });
}

export async function getMyLifetimeStats() {
  return request<UsersApi.MyLifetimeStats>({
    method: 'GET',
    url: '/users/lifetime-stats',
  });
}

export async function getMyRanking(params: UsersApi.MyRankingParams) {
  return request<UsersApi.MyRankingResult>({
    method: 'GET',
    url: '/users/my-ranking',
    params,
  });
}

export async function getRankingList(params: UsersApi.RankingListPrams) {
  return request<UsersApi.RankingListResult>({
    method: 'GET',
    url: '/users/ranking',
    params,
  });
}
