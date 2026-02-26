import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MenuItem extends Document {

    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurantId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    image: string

    @Prop({ required: true })
    imageId: string

    @Prop({ required: true })
    price: number;

    @Prop()
    discountPrice: number;

    @Prop()
    itemType: string;

    @Prop({ default: true })
    isAvailable: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
