// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
// import { NotificationDto } from './notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prismaService: PrismaService) {}

  async getNotificationById(id: string): Promise<Notification[]> {
    return await this.prismaService.notification.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
