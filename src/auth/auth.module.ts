import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStartegy } from './startegy/jwt.startegy';
import { RolesGuard } from './guards/Roles.guard';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {name: Otp.name, schema: OtpSchema}
    ]),
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStartegy, RolesGuard],
  exports: [AuthService, JwtStartegy, RolesGuard]
})
export class AuthModule { }
