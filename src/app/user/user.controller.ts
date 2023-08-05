import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { MyJwtGuard } from 'src/common/guard';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Roles } from 'src/common/decorator';
import { GetUser } from 'src/common/decorator/user.decorator';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private userService: UserService) {}
  // @UseGuards(AuthGuard('jwt'))
  @Roles('Admin')
  @Get('')
  async getAll(): Promise<User[]> {
    return await this.userService.getUser();
  }

  @Get('getById')
  async getUserById(@GetUser('id') userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
