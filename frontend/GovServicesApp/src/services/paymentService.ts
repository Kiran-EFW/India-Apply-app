import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:3000';

export const paymentService = {
  async makePayment(amount: number, description: string) {
    try {
      // Create order on backend
      const token = await getToken();
      const receipt = `receipt_${Date.now()}`;
      const orderResponse = await axios.post(
        `${API_URL}/razorpay/create-order`,
        { amount, receipt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { id: orderId, amount: orderAmount, currency } = orderResponse.data;

      // In a real app, we would open Razorpay checkout
      // For now, we'll simulate the payment
      console.log('Payment order created:', orderResponse.data);
      
      return { success: true, orderId };
    } catch (error) {
      console.error('Payment error:', error);
      throw new Error('Payment failed');
    }
  },

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const token = await getToken();
      const verifyResponse = await axios.post(
        `${API_URL}/razorpay/verify-payment`,
        {
          paymentId,
          orderId,
          signature,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return verifyResponse.data.isValid;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Payment verification failed');
    }
  },
};
