import { PassportSerializer } from "@nestjs/passport";
import { Inject } from '@nestjs/common';
import { User } from "@prisma/client";
import { AuthService } from "src/app/auth/auth.service";

export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject(AuthService)
        private readonly authservice: AuthService
    ){
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user)
    }

    deserializeUser(payload: any, done: Function) {
        const user = this.authservice.findUser(payload.id);
        return user ? done(null, user) : done(null, null);
    }
}