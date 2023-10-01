import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { RoomStatusTask } from "./room-status.task";
import { RoomStatusCron } from "./room-status.cron";

@Module({
    imports:[ScheduleModule.forRoot()],
    providers:[RoomStatusTask,RoomStatusCron],
})

export class TaskModule{}