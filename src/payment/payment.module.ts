import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Payment, PaymentSchema } from './schema/payment.entity';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Order.name, schema: OrderSchema},
    {name: Payment.name, schema: PaymentSchema}
  ])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
