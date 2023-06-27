import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { JwtStrategy } from "src/common/strategy";
import { GoogleStrategy } from "src/common/strategy/google.strategy";
import { SessionSerializer } from "src/common/serializers/serializer";

@Module({
    imports: [JwtModule.register({})],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy, GoogleStrategy,SessionSerializer]
})
export class AuthModule{}