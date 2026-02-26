import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
    Pending = 'pending',
    AcceptedByRestaurant = 'accepted_by_restaurant',
    Rejected = 'rejected',
    Completed = 'completed',
}

export enum PaymentStatus {
    Pending = 'pending',
    Success = 'success',
    Failed = 'failed',
}

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true, index: true })
    restaurantId: Types.ObjectId;

    @Prop({
        type: [
            {
                itemId: { type: Types.ObjectId, ref: 'MenuItem', required: true },
                quantity: { type: Number, required: true },
            },
        ],
        required: true,
    })
    items: {
        itemId: Types.ObjectId;
        quantity: number;
    }[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ enum: Object.values(OrderStatus), default: OrderStatus.Pending })
    orderStatus: OrderStatus;

    @Prop({ enum: Object.values(PaymentStatus), default: PaymentStatus.Pending })
    paymentStatus: PaymentStatus;

    @Prop()
    restaurantAcceptedAt?: Date;

    @Prop()
    paymentCompletedAt?: Date;

    @Prop({
        type: {
            lat: Number,
            lng: Number,
        },
    })
    deliveryLocation: {
        lat: number;
        lng: number;
    };

    @Prop()
    deliveryAddress: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ restaurantId: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
