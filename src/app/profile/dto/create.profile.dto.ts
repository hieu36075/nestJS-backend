import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProfileDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string

    @IsString()
    @IsDefined()
    @ApiProperty()
    address?: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string 

    @IsString()
    @IsDefined()
    @ApiProperty()
    avatarUrl?: string 



}

