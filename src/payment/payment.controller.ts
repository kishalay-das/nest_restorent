import { Controller, Post, Body, Req, Res, Headers, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/Auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(JwtAuthGuard)
  @Post('make-payment')
  async createPayment(@Body('orders') orders: any) {
    return this.paymentService.createPayment(orders);
  }

  @UseGuards(JwtAuthGuard)
  @Post('intent')
  async createPaymentIntent(@Body() dto: CreatePaymentDto) {
    const intent = await this.paymentService.createPaymentIntent(
      dto.amount,
      dto.currency || 'inr',
    );

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckout(@Body() dto: CreateCheckoutDto) {
    
    const session = await this.paymentService.createCheckoutSession(
      dto.items,
      dto.orderIds
    );

    return {
      success: true,
      message: 'Checkout session created',
      url: session?.url || null,
      sessionId: session?.id,
    };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody: Buffer },
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = this.paymentService.verifyWebhook(signature, req.rawBody);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as any;
          console.log('✅ Checkout Session Completed:', session.id);
          await this.paymentService.handleCheckoutSessionCompleted(session);
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as any;
          console.log('✅ Payment Intent Succeeded:', paymentIntent.id);
          // Payment already handled in checkout.session.completed
          break;

        case 'payment_intent.payment_failed':
          const failedIntent = event.data.object as any;
          console.log('❌ Payment Intent Failed:', failedIntent.id);
          await this.paymentService.handlePaymentIntentFailed(failedIntent);
          break;

        case 'charge.failed':
          const failedCharge = event.data.object as any;
          console.log('❌ Charge Failed:', failedCharge.id);
          break;

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return res.status(400).json({ error: 'Webhook processing failed' });
    }

    res.json({ received: true });
  }
}
