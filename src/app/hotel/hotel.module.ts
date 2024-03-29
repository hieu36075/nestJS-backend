import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

@Module({
  imports: [],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
