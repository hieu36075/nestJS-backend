import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'longngu@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userName: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;


}
