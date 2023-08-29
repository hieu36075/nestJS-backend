import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentIntentId: string;
}