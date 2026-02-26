import { Module } from '@nestjs/common';
import { RestorentService } from './restorent.service';
import { RestorentController } from './restorent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './schema/restorent.schema';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Restaurant.name, schema: RestaurantSchema}
  ]),
  UploadModule
],
  controllers: [RestorentController],
  providers: [RestorentService],
})
export class RestorentModule {}
