import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
    USER = 'user',
    Admin = 'admin',
    Restorent = 'restorent'
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ unique: true })
    phone: string;

    @Prop({
        required: true,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    })
    role: UserRole;

    @Prop({ required: true })
    password: string;

    @Prop({ default: false })
    isVeryfied: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
