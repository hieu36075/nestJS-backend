import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { JwtStrategy } from 'src/common/strategy';
import { SocketModule } from 'src/providers/socket/socket.module';
import { RtStrategy } from 'src/common/strategy/rt.strategy';
import { ProfileModule } from '../profile/profile.module';


@Module({
  imports: [JwtModule.register({}), SocketModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RtStrategy],
})
export class AuthModule {}
