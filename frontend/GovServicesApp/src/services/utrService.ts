import axios from 'axios';
import { getToken } from './authService';
import { UTR } from '../types';

const API_URL = 'http://localhost:3000';

export const utrService = {
  async generateUTR(paymentDetails: any): Promise<UTR> {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/utr/generate`,
        paymentDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('UTR generation error:', error);
      throw new Error('Failed to generate UTR');
    }
  },

  async getUTR(utrNumber: string): Promise<UTR> {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/utr/${utrNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('UTR fetch error:', error);
      throw new Error('Failed to fetch UTR');
    }
  },

  async getUserUTRs(): Promise<UTR[]> {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/utr`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('UTRs fetch error:', error);
      throw new Error('Failed to fetch UTRs');
    }
  },
};
