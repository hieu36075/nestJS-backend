import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import {ExtractJwt, Strategy} from "passport-jwt"
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService: ConfigService,
        public prismaService: PrismaService,
        ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }
    // async validate(payload: {sub: number; email: string}) {        
    //     const user = await this.prismaService.user.findUnique({
    //         where: {
    //             id: payload.sub
    //         }
    //     })
    //     delete user.hashedPassword
    //     return user;
    //   }

    async validate(payload: User){
        return {'user' : payload}
    }
}

