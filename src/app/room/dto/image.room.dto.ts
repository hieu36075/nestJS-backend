import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ImageRoomDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}