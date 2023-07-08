import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator"

export class CreateProfileDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    avatarUrl: string 



}

