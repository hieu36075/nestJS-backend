import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GetUser } from 'src/common/decorator/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator';

@Controller('notifications')
@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Roles('User')
  @Get()
  async getNotificationById(@GetUser('id') id: string) {
    return await this.notificationService.getNotificationById(id);
  }
}
