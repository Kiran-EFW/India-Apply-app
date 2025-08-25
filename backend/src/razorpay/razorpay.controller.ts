import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RazorpayService, CreateOrderDto, PaymentVerificationDto } from './razorpay.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create a payment order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.razorpayService.createOrder(createOrderDto);
  }

  @Post('verify-payment')
  @ApiOperation({ summary: 'Verify payment' })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  async verifyPayment(@Body() paymentVerificationDto: PaymentVerificationDto) {
    return this.razorpayService.verifyPayment(paymentVerificationDto);
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Payment details retrieved successfully' })
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    return this.razorpayService.getPaymentDetails(paymentId);
  }
}
