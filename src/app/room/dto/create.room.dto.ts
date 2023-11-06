import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"
import { ImageRoomDTO } from "./image.room.dto"

export class CreateRoomDTO{
    @ApiProperty()
    id?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string 

    @IsInt()
    @ApiProperty()
    price : number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId: string


    @IsInt()
    @Min(0)
    @Max(10)
    @ApiProperty()
    occupancy : number


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    categoryRoomId: string
}

