import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({timestamps: true})
export class Payment extends Document {
    @Prop({type: [Types.ObjectId], ref: "Order", required: true})
    orderIds: Types.ObjectId[]

    @Prop({required: true})
    stripePaymentIntentId: string

    @Prop({required: true})
    amount: number

    @Prop({required: true, default: 'pending'})
    status: 'pending' | 'success' | 'failed'

    @Prop()
    stripeSessionId?: string

    @Prop()
    failureReason?: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
