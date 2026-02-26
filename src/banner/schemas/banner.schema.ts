import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Banner extends Document {
    @Prop({required: true})
    name: string

    @Prop()
    image: string

    @Prop()
    imageId: string
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
