import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class UpdateRoomDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description?: string 

    @IsInt()
    @ApiProperty()
    price?: number

    @IsBoolean()
    @ApiProperty({ default: true })
    isAvaiable?: boolean = true;


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId?: string


    @IsInt()
    @Min(0)
    @Max(10)
    @ApiProperty()
    occupancy?: number


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    categoryRoomId?: string

}

