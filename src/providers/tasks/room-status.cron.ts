// src/tasks/room-status.cron.ts
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { RoomStatusTask } from './room-status.task';

@Injectable()
export class RoomStatusCron {
  constructor(private readonly roomStatusTask: RoomStatusTask) {}

  @Cron(CronExpression.EVERY_HOUR) // You can adjust the schedule based on your needs
  // @Cron('5 * * * * *')
  async handleCron() {
    console.log('Running room status update task...');
    await this.roomStatusTask.updateRoomStatus();
  }
}
