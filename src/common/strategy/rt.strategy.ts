import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService : ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('RT_SECRET'),
            passReqToCallback: true
        })
    }
    validate(req: Request, payload: User){
        const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
  
      if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
  
      return {
        ...payload,
        refreshToken,
      };
    }
}