export enum TierEnum {
  FREE = 'free',
  INDIE = 'indie',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface User {
  id: string;
  email: string;
  tier: TierEnum;
  monthly_volume: number;
  created_at: string;
}

export interface APIKey {
  id: string;
  name: string;
  key?: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface Subscription {
  id: string;
  tier: TierEnum;
  status: string;
  client_secret?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  fee_amount: number;
  status: string;
  currency: string;
  client_secret?: string;
}

export interface RateLimitUsage {
  minute_remaining: number;
  hour_remaining: number;
}

export interface UsageCalls {
  today: number;
  month: number;
}

export interface Usage {
  tier: TierEnum;
  monthly_volume: number;
  rate_limits: RateLimitUsage;
  calls: UsageCalls;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface HealthResponse {
  status: string;
  version: string;
}
