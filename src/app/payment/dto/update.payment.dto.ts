import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdatePaymentIntentDTO {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;




}