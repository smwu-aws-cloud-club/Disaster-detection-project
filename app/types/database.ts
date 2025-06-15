export interface Address {
  city: string;
  district: string;
  detail: string;
}

export interface Member {
  id: number;
  name: string;
  phoneNum: string;
  password: string;
  address: Address;
  verified: boolean;
  refreshToken: string;
}

export interface FCMToken {
  token: string;
  createdAt: number;
  expireAt: number;
  topics: string[];
  fcmSubStatus: string;
  lastSubscriptionAttemptAt: number;
}

export interface Region {
  region: string;
  status: boolean;
  timestamp: number;
}

export interface CCTVItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  cctvUrl: string;
  city: string;
  district: string;
  town: string;
  status: boolean;
} 