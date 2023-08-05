import { Module } from '@nestjs/common';
import { CategoryRoomController } from './categoryRoom.controller';
import { CategoryRoomSerive } from './categoryRoom.service';

@Module({
  imports: [],
  controllers: [CategoryRoomController],
  providers: [CategoryRoomSerive],
})
export class CategoryRoomModule {}
