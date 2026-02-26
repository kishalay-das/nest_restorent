import { BadRequestException, ConflictException, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt'
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { send } from 'helpers/sendEmail';
import { Otp } from './schema/otp.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userSchema: Model<User>,
        @InjectModel(Otp.name) private otpSchema: Model<Otp>,
        private readonly jwtService: JwtService
    ) { }
    async register(registerData: registerDto) {
        const { name, email, phone, password } = registerData
        const user = await this.userSchema.findOne({ email })
        if (user) {
            throw new ConflictException('user already exist with this cridencials!')
        }
        const hasePass = await bcrypt.hash(password, 12)
        const newUser = await this.userSchema.create({ name, email, phone, password: hasePass })
        return {
            message: 'user register successfully',
            user: {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        }
    }

    async login(loginData: loginDto) {
        const user = await this.userSchema.findOne({ email: loginData.email })
        if (!user) {
            throw new UnauthorizedException('wrong email or password!')
        }
        const isMatch = await bcrypt.compare(loginData.password, user.password)
        if (!isMatch) {
            throw new UnauthorizedException('wrong email or password!')
        }
        const token = this.generateTokens(user)
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }

    async findUserByID(id: string) {
        const user = await this.userSchema.findById(id)
        if (!user) {
            throw new NotFoundException(`user not found with this id`)
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }

    async getOtp(usermail: string, userId: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpSchema.create({
            userId,
            email: usermail,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        });

        const subject = 'verify user'
        const senderId = process.env.MAIL_USER!
        const reciverId = usermail
        const text = `Your email verification code is ${otp}`
        return await send({ senderId, receiverId: reciverId, subject, text });
    }

    async verifyOtp(email: string, otp: string) {
        console.log(otp);
        
        const verify = await this.otpSchema.findOne({ email, otp })
        
        if (!verify) {
            throw new UnauthorizedException('Invalid Otp')
        }
        const user = await this.userSchema.findOne({ email })
        if (!user) {
            throw new NotFoundException('user not found!')
        }
        user.isVeryfied = true
        await user?.save()
        return {
            success: true,
            message: "Email verified successfully!",
            user
        }
    }

    private generateTokens(user: User) {
        const payload = {
            email: user.email,
            sub: user._id,
            role: user.role
        }
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d'
        })
    }
}
