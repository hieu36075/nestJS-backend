import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateOrderDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    checkIn: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    checkOut: string; 

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price : number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId : string

    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    roomId : string
}

