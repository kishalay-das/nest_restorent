import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus, PaymentStatus } from './schema/order.schema';
import { MenuItem } from 'src/menu/schema/menu.schema';
import { IPaginationResponseFormat } from 'common/interface/pagination-interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderSchema: Model<Order>,
    @InjectModel(MenuItem.name) private readonly menuIteSchema: Model<MenuItem>,
  ) { }

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    lat: number,
    lng: number
  ) {
    const { items, restaurantId, deliveryAddress } = createOrderDto;

    const itemDetails = await this.menuIteSchema.find({
      _id: { $in: items.map(i => i.itemId) },
      isAvailable: true
    });

    // console.log(itemDetails);

    if (itemDetails.length !== items.length) {
      throw new BadRequestException("Invalid items or cross-restaurant items detected");
    }

    // Quantity map
    const qtyMap = new Map(
      items.map(i => [i.itemId.toString(), i.quantity])
    );

    // Calculate total
    let totalAmount = 0;

    const orderItems = itemDetails.map(item => {
      const quantity = qtyMap.get(item._id.toString())!;
      const unitPrice = item.discountPrice ?? item.price;
      totalAmount += unitPrice * quantity;

      return {
        itemId: item._id,
        quantity
      };
    });

    // Create order doc
    const orderDoc = {
      userId: new Types.ObjectId(userId),
      restaurantId: new Types.ObjectId(restaurantId),
      items: orderItems,
      totalAmount,
      deliveryLocation: { lat, lng },
      deliveryAddress
    };

    const order = await this.orderSchema.create(orderDoc);

    return {
      message: "Order created successfully!",
      orderId: order._id.toString()
    };
  }


  async findAllOrder(page: number = 1, limit: number = 10): Promise<IPaginationResponseFormat<Order>> {

    const skip = (page - 1) * limit;

    // Run queries in parallel (performance optimized)
    const [orders, totalItems] = await Promise.all([
      this.orderSchema
        .find()
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderSchema.countDocuments()
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: orders,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
      }
    };
  }

  async findRestaurantAllOrders(restaurantId: string) {
    const orders = await this.orderSchema.find({ restaurantId: new Types.ObjectId(restaurantId) })
    return orders
  }

  async acceptOrder(orderId: string) {
    const order = await this.orderSchema.findById(orderId)
    if (!order) {
      throw new NotFoundException('Order not found with this Id')
    }
    if (order.orderStatus !== OrderStatus.Pending) {
      throw new BadRequestException('Order can only be accepted when in Pending status')
    }
    order.orderStatus = OrderStatus.AcceptedByRestaurant
    order.restaurantAcceptedAt = new Date()
    await order.save()
    return {
      success: true,
      message: 'Order accepted successfully by restaurant',
      orderId: order._id.toString()
    }
  }
  
  async rejectOrder(orderId: string) {
    const order = await this.orderSchema.findById(orderId)
    if (!order) {
      throw new NotFoundException('Order not found with this Id')
    }
    if (order.orderStatus !== OrderStatus.Pending) {
      throw new BadRequestException('Order can only be rejected when in Pending status')
    }
    order.orderStatus = OrderStatus.Rejected
    await order.save()
    return {
      success: true,
      message: 'Order rejected by restaurant',
      orderId: order._id.toString()
    }
  }

  async findUserAllOrder(userId: string) {

    const orders = await this.orderSchema.find({ userId: new Types.ObjectId(userId) }).populate("items.itemId")
    // console.log(orders);
    
    return orders
  }

  findOne(id: number) {
    return this.orderSchema.findById(id).populate(['userId', 'restaurantId', 'items.itemId']);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderSchema.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true }
    );
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return {
      message: 'Order updated successfully',
      order
    };
  }

  async remove(id: number) {
    const order = await this.orderSchema.findByIdAndDelete(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return {
      message: 'Order deleted successfully'
    };
  }

  async getOrderWithPaymentStatus(orderId: string) {
    const order = await this.orderSchema
      .findById(orderId)
      .populate(['userId', 'restaurantId', 'items.itemId'])
      .lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order._id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      restaurantAcceptedAt: order.restaurantAcceptedAt || null,
      paymentCompletedAt: order.paymentCompletedAt || null,
      createdAt: order.createdAt,
      order
    };
  }
}
