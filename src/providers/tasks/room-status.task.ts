// src/tasks/room-status.task.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class RoomStatusTask {
  constructor(private readonly prismaService: PrismaService) {}

  async updateRoomStatus(): Promise<void> {
    const order = await this.prismaService.order.findMany({
      where:{
        
      }
    })
    // TODO: Logic to update room status based on check-out time
    // Retrieve orders that need to be checked for room status update

  //   const ordersToCheck = await this.prisma.order.findMany({
  //     where: {
  //       checkOut: {
  //         lte: new Date(), // Check if check-out time is less than or equal to current time
  //       },
  //     },
  //     select: {
  //       roomId: true,
  //     },
  //   });

  //   // Update room status for each order
  //   for (const order of ordersToCheck) {
  //     await this.prisma.room.update({
  //       where: {
  //         id: order.roomId,
  //       },
  //       data: {
  //         status: 'AVAILABLE', // Set room status to AVAILABLE
  //       },
  //     });
  //   }
      console.log('thanh cong')
      
  }
}
