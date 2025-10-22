import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  User,
  APIKey,
  Subscription,
  Transaction,
  Usage,
  TierEnum,
  LoginResponse,
  HealthResponse,
} from './types';
import {
  SwiftAPIError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
} from './errors';

export interface SwiftAPIConfig {
  apiKey?: string;
  baseURL?: string;
}

export class SwiftAPI {
  private client: AxiosInstance;
  private accessToken?: string;

  constructor(config: SwiftAPIConfig = {}) {
    const { apiKey, baseURL = 'https://api.getswiftapi.com' } = config;

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
    }

    this.client.interceptors.request.use((config) => {
      if (this.accessToken && !apiKey) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const statusCode = error.response.status;
          const message =
            (error.response.data as any)?.detail || error.message;

          if (statusCode === 401) {
            throw new AuthenticationError(message, statusCode);
          } else if (statusCode === 404) {
            throw new NotFoundError(message, statusCode);
          } else if (statusCode === 429) {
            throw new RateLimitError(message, statusCode);
          } else {
            throw new SwiftAPIError(message, statusCode);
          }
        }
        throw new SwiftAPIError(error.message);
      }
    );
  }

  async signup(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/signup', {
      email,
      password,
    });
    this.accessToken = response.data.access_token;
    return response.data;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    this.accessToken = response.data.access_token;
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async createAPIKey(name: string): Promise<APIKey> {
    const response = await this.client.post<APIKey>('/api-keys', { name });
    return response.data;
  }

  async listAPIKeys(): Promise<APIKey[]> {
    const response = await this.client.get<APIKey[]>('/api-keys');
    return response.data;
  }

  async deleteAPIKey(keyId: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(
      `/api-keys/${keyId}`
    );
    return response.data;
  }

  async createSubscription(tier: TierEnum): Promise<Subscription> {
    const response = await this.client.post<Subscription>('/subscriptions', {
      tier,
    });
    return response.data;
  }

  async createPayment(
    amount: number,
    currency: string = 'usd',
    metadata: Record<string, any> = {}
  ): Promise<Transaction> {
    const response = await this.client.post<Transaction>('/payments', {
      amount,
      currency,
      metadata,
    });
    return response.data;
  }

  async getUsage(): Promise<Usage> {
    const response = await this.client.get<Usage>('/usage');
    return response.data;
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }
}
