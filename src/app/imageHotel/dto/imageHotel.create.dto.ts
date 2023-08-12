import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"


export class CreateImageHotelDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    url: string

}

