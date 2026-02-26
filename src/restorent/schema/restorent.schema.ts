import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant extends Document {

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    ownerId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({required: true})
    image: string

    @Prop({required: true})
    imageId: string

    @Prop({ required: true })
    addressLine: string;  

    @Prop({ required: true })
    city: string;

    @Prop()
    state: string;

    @Prop({ default: 'India' })
    country: string;

    @Prop()
    pincode: string;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
        },
        coordinates: {
            type: [Number], 
            required: true,
        },
    })
    location: {
        type: 'Point';
        coordinates: [number, number];
    };

    @Prop({ default: false })
    isVerified: boolean;  

    @Prop({ default: true })
    isOpen: boolean;

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ location: '2dsphere' });
