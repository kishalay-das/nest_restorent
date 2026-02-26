import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { CurrentUser } from './decorators/current-user.decoraters';
import { JwtAuthGuard } from './guards/Auth.guard';
import { OtpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async userRegister(@Body() registerData: registerDto){
        return await this.authService.register(registerData)
    }

    @Post('login')
    async userLogin(@Body() loginData: loginDto){
        return this.authService.login(loginData)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async userProfile(@CurrentUser() user: any){
        return user
    }
    @UseGuards(JwtAuthGuard)
    @Get('send-otp')
    async sendOtp(@CurrentUser() user: any){
        return await this.authService.getOtp(user.email, user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify-otp')
    async verifyOtp(@CurrentUser() user: any, @Body() data: OtpDto){        
        return await this.authService.verifyOtp(user.email,data.otp)
    }
}
