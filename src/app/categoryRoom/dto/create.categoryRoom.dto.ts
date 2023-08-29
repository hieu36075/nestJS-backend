import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryRoomDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId: string

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    numberOrBeds: number

}