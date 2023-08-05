import { Controller } from '@nestjs/common';
import { RoomService } from './room.serice';

@Controller()
export class RoomController {
  constructor(private roomService: RoomService) {}
}
