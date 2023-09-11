import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class UpdateOrderDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    checkIn?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    checkOut?: string; 

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price?: number

    
}

