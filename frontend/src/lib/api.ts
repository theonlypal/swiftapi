import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = Cookies.get('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async signup(email: string, password: string) {
    const response = await this.client.post('/auth/signup', { email, password });
    if (response.data.access_token) {
      Cookies.set('access_token', response.data.access_token);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.access_token) {
      Cookies.set('access_token', response.data.access_token);
    }
    return response.data;
  }

  logout() {
    Cookies.remove('access_token');
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async createAPIKey(name: string) {
    const response = await this.client.post('/api-keys', { name });
    return response.data;
  }

  async listAPIKeys() {
    const response = await this.client.get('/api-keys');
    return response.data;
  }

  async deleteAPIKey(keyId: string) {
    const response = await this.client.delete(`/api-keys/${keyId}`);
    return response.data;
  }

  async createSubscription(tier: string) {
    const response = await this.client.post('/subscriptions', { tier });
    return response.data;
  }

  async createPayment(amount: number, currency: string, metadata: object) {
    const response = await this.client.post('/payments', { amount, currency, metadata });
    return response.data;
  }

  async getUsage() {
    const response = await this.client.get('/usage');
    return response.data;
  }
}

export const api = new APIClient();
