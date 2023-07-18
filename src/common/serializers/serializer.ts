import { PassportSerializer } from "@nestjs/passport";
import { Inject } from '@nestjs/common';
import { User } from "@prisma/client";
import { AuthService } from "src/app/auth/auth.service";

export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject(AuthService)
        private  authservice: AuthService
    ){
        super();
    }

    serializeUser(user: User, done: Function) {
        console.log("serializeUser", user)
        delete user.hashedPassword
        done(null, user)
    }

    deserializeUser(payload: any, done: Function) {
        console.log("deserializeUser", payload)
        const user = this.authservice.findUser(payload.id);
        return user ? done(null, user) : done(null, null);
    }
}