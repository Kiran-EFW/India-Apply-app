import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt,
        payment_capture: 1, // Auto capture payment
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw new Error('Failed to create Razorpay order');
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const generatedSignature = this.crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Payment verification failed');
    }
  }

  private get crypto() {
    const crypto = require('crypto');
    return crypto;
  }
}
