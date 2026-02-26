import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { MenuItem, MenuItemSchema } from 'src/menu/schema/menu.schema';

@Module({
  imports: [AuthModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      {name: MenuItem.name, schema: MenuItemSchema}
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
