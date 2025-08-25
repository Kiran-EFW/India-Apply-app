import { Controller, Post, Body } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(@Body() body: { amount: number; receipt: string }) {
    return await this.razorpayService.createOrder(body.amount, 'INR', body.receipt);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: { paymentId: string; orderId: string; signature: string }) {
    const isValid = await this.razorpayService.verifyPayment(
      body.paymentId,
      body.orderId,
      body.signature,
    );
    return { isValid };
  }
}
