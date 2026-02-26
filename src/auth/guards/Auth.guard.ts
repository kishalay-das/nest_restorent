import { Injectable, UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
      canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw new UnauthorizedException('Please Login First!');
        }
        
        if (!user.isVeryfied) {
            throw new UnauthorizedException('Please verify your account');
        }
        
        return user;
    }
}
