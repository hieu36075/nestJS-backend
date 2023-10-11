import {
  Controller,
  Get,
  Param,
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
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationResult } from 'src/common/interface/pagination.interface';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private userService: UserService) {}
  // @UseGuards(AuthGuard('jwt'))
  @Roles('Admin')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    ): Promise<PaginationResult<User>> {
    return await this.userService.getUser(page, perPage);
  }

  @Get('get-your-profile')
  async getUserById(@GetUser('id') userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }
  
  @Public()
  @Get('userInMonth')
  async userInMonth(){
    return this.userService.getUsersCountThisAndLastMonth();
  }
  @Public()
  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<User>{
    return this.userService.getUserById(userId)
  }

}
