import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator"

export class UpdateProfileDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName?: string

    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty()
    // fullName?: string

    @ApiProperty()
    address?: string 

    @ApiProperty()
    phoneNumber?: string 

    @ApiProperty()
    avatarUrl?: string 

}

