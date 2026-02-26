import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RestorentModule } from './restorent/restorent.module';
import { MenuModule } from './menu/menu.module';
import { UploadModule } from './upload/upload.module';
import { OrderModule } from './order/order.module';
import { BannerModule } from './banner/banner.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string,{
      dbName: 'appdb',
      retryAttempts: 5,
      retryDelay: 3000,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    }),
    AuthModule,
    RestorentModule,
    MenuModule,
    UploadModule,
    OrderModule,
    BannerModule,
    PaymentModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
