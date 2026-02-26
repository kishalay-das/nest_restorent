import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus, PaymentStatus } from 'src/order/schema/order.schema';
import { Payment } from './schema/payment.entity';
import Stripe from 'stripe'

@Injectable()
export class PaymentService {
  private stripe: Stripe
  
  constructor(
    @InjectModel(Order.name) private orderSchema: Model<Order>,
    @InjectModel(Payment.name) private paymentSchema: Model<Payment>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-01-28.clover'
    })
  }

  /**
   * Validate that all orders are accepted by their respective restaurants
   */
  async validateRestaurantAcceptance(orderIds: string[]): Promise<boolean> {
    if (!orderIds || orderIds.length === 0) {
      throw new BadRequestException('Order IDs are required');
    }

    const orders = await this.orderSchema.find({
      _id: { $in: orderIds.map(id => new Types.ObjectId(id)) }
    });

    if (orders.length !== orderIds.length) {
      throw new NotFoundException('One or more orders not found');
    }

    // Check if all orders are accepted by restaurant
    const nonAcceptedOrders = orders.filter(
      order => order.orderStatus !== OrderStatus.AcceptedByRestaurant
    );

    if (nonAcceptedOrders.length > 0) {
      throw new BadRequestException(
        `${nonAcceptedOrders.length} order(s) not yet accepted by restaurant. Orders must be accepted before payment can be initiated.`
      );
    }

    // Check all orders are from same user (payment must be from order creator)
    const userIds = new Set(orders.map(o => o.userId.toString()));
    if (userIds.size > 1) {
      throw new BadRequestException('Orders must be from the same user');
    }

    return true;
  }

  /**
   * Prepare payment items from orders (deprecated - use createCheckoutSession instead)
   */
  async createPayment(orderId: string[]) {
    if (!orderId || orderId.length === 0) {
      throw new BadRequestException('Order IDs are required!');
    }

    // Validate restaurant acceptance
    await this.validateRestaurantAcceptance(orderId);

    const orders = await Promise.all(
      orderId.map((id) => this.orderSchema.findById(id).populate('items.itemId'))
    );

    if (orders.length === 0) {
      throw new NotFoundException('Orders not found!');
    }

    const items = orders.flatMap(order =>
      order?.items.map(item => {
        const menuItem = item.itemId as any;
        return {
          orderId: order._id.toString(),
          menuItemId: menuItem._id.toString(),
          name: menuItem.name,
          price: menuItem.discountPrice ?? menuItem.price,
          qty: item.quantity!,
          image: menuItem.image,
        };
      })
    );

    const totalAmount = items.reduce((sum, item) => sum + item?.price! * item?.qty!, 0);
    return { items, totalAmount, orderId };
  }

  /**
   * Create payment intent for Stripe
   */
  createPaymentIntent(amount: number, currency = 'inr') {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true }
    });
  }

  /**
   * Create checkout session with multiple orders
   */
  async createCheckoutSession(items: any[], orderIds: string | string[]) {
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Items array is required');
    }

    // Convert single orderId to array
    const orderIdArray = Array.isArray(orderIds) ? orderIds : [orderIds];

    // Validate restaurant acceptance
    await this.validateRestaurantAcceptance(orderIdArray);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        if (!item.name || !item.price || !item.qty) {
          throw new BadRequestException('Invalid item structure');
        }

        return {
          price_data: {
            currency: 'inr',
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
          },
          quantity: item.qty,
        };
      });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: { orderIds: orderIdArray.join(',') },
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
    });

    return session;
  }

  /**
   * Store payment record in database
   */
  async storePayment(
    orderIds: string[],
    stripePaymentIntentId: string,
    amount: number,
    stripeSessionId?: string,
    status: 'success' | 'failed' = 'success'
  ) {
    // Create payment record
    const payment = await this.paymentSchema.create({
      orderIds: orderIds.map(id => new Types.ObjectId(id)),
      stripePaymentIntentId,
      stripeSessionId,
      amount,
      status,
    });

    // Update order payment status if success
    if (status === 'success') {
      await this.orderSchema.updateMany(
        { _id: { $in: orderIds.map(id => new Types.ObjectId(id)) } },
        {
          paymentStatus: PaymentStatus.Success,
          paymentCompletedAt: new Date(),
        }
      );
    } else {
      await this.orderSchema.updateMany(
        { _id: { $in: orderIds.map(id => new Types.ObjectId(id)) } },
        { paymentStatus: PaymentStatus.Failed }
      );
    }

    return payment;
  }

  /**
   * Verify Stripe webhook signature
   */
  verifyWebhook(signature: string, body: Buffer) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  }

  /**
   * Handle successful checkout session
   */
  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const orderIds = session.metadata?.orderIds?.split(',') || [];

    if (!orderIds || orderIds.length === 0) {
      throw new BadRequestException('No order IDs found in session metadata');
    }

    const amount = session.amount_total ? session.amount_total / 100 : 0;

    return await this.storePayment(
      orderIds,
      session.payment_intent as string,
      amount,
      session.id,
      'success'
    );
  }

  /**
   * Handle failed payment
   */
  async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const orderIds = paymentIntent.metadata?.orderIds?.split(',') || [];

    if (!orderIds || orderIds.length === 0) {
      console.warn('No order IDs found in payment intent metadata');
      return;
    }

    return await this.storePayment(
      orderIds,
      paymentIntent.id,
      paymentIntent.amount / 100,
      undefined,
      'failed'
    );
  }
}
