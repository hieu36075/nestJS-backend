import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "src/app/auth/auth.service";
import { PrismaService } from "src/database/prisma/prisma.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        configserver: ConfigService,
        private authSerivce: AuthService
    ){
        super({
            authozrizationURL: 'http://localhost:3500',
            clientID: configserver.get("GOOGLE_CLIENT_ID"),
            clientSecret: configserver.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: 'http://localhost:3500/auth/google/redirect',
            scope:['profile', 'email'],
        })
    }
    
    async validate(accessToken: string, refreshToken: string, profile: Profile ): Promise<any>{
        const user = await this.authSerivce.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName
        })
        console.log('Validate');
        console.log(user);
        return user || null;
    }
}