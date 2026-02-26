import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class Otp extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId

    @Prop({required: true})
    email: string

    @Prop({required: true})
    otp: string

    @Prop({
        default: Date.now,
        expires: 300,
    })
    expiresAt: Date;
}


export const OtpSchema = SchemaFactory.createForClass(Otp)