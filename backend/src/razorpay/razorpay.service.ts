import { Injectable } from '@nestjs/common';
const Razorpay = require('razorpay');

export interface CreateOrderDto {
  amount: number;
  currency: string;
  receipt: string;
  notes?: any;
}

export interface PaymentVerificationDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

@Injectable()
export class RazorpayService {
  private razorpay: any;

  constructor() {
    // Initialize Razorpay with API keys
    // In production, these would come from environment variables
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.razorpay.orders.create({
        amount: createOrderDto.amount * 100, // Convert to paise
        currency: createOrderDto.currency,
        receipt: createOrderDto.receipt,
        notes: createOrderDto.notes,
      });

      return {
        success: true,
        order,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create order',
      };
    }
  }

  async verifyPayment(paymentVerificationDto: PaymentVerificationDto) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentVerificationDto;
      
      // Verify the payment signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const crypto = require('crypto');
      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
        .update(text)
        .digest('hex');

      if (signature === razorpay_signature) {
        return {
          success: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          message: 'Payment verified successfully',
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Payment verification failed',
      };
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment,
        message: 'Payment details retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve payment details',
      };
    }
  }
}
