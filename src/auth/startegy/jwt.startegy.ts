import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!
        })
    }
    async validate(payload: any) {
        try {
            const user = await this.authService.findUserByID(payload.sub)
            return {
                ...user,
                role: payload.role
            }
        } catch (error) {
            throw new UnauthorizedException('INVALID TOKEN')
        }
    }
}