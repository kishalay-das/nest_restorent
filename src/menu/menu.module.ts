import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { UploadModule } from 'src/upload/upload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './schema/menu.schema';
import { Restaurant, RestaurantSchema } from 'src/restorent/schema/restorent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: MenuItem.name, schema: MenuItemSchema},
      { name: Restaurant.name, schema: RestaurantSchema }
    ]),
    UploadModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
