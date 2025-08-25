import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const API_URL = 'http://localhost:3000';

export const authService = {
  async login(phone: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
    return response.data;
  },

  async register(userData: any) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const token = await this.getToken();
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async storeToken(token: string) {
    await AsyncStorage.setItem('auth_token', token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  },

  async removeToken() {
    await AsyncStorage.removeItem('auth_token');
  },
};
