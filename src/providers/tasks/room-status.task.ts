// src/tasks/room-status.task.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class RoomStatusTask {
  constructor(private readonly prismaService: PrismaService) { }

  async updateRoomStatus(): Promise<void> {
    const orders = await this.prismaService.order.findMany({
      where: {
        status: 'DONE'
      },
      include: {
        orderdetails: true
      }
    });

    for (const order of orders) {
      const room = await this.prismaService.room.findUnique({
        where: {
          id: order.orderdetails[0].roomId,
        },
      });
      if (room.status === 'BOOKED') {
        const currentDate = new Date();
        const expectedCheckOutTime = new Date(order.checkOut);
        if (currentDate > expectedCheckOutTime) {
          await this.prismaService.room.update({
            where: {
              id: room.id
            },
            data: {
              status: 'AVAILABLE'
            },
          });
        };
      };
    };
  };
}
