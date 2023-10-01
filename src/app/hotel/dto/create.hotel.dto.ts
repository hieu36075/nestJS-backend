import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"
import { PeekDTO } from "./amentity.hotel.dto"
export class CreateHotelDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber : string

    @IsInt()
    @Min(0)
    @Max(5)
    @ApiProperty()
    starRating? : number

    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    countryId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    categoryId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    checkInTime: string; // Sử dụng kiểu string cho checkInTime

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    
    checkOutTime: string;// Sử dụng kiểu string cho checkOutTime

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    extraInfo: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cityId: string

    @IsNumber()
    @IsDefined()
    @ApiProperty()
    latitude: number;  // Sử dụng kiểu number cho latitude
  
    @IsNumber()
    @IsDefined()
    @ApiProperty()
    longitude: number;  // Sử dụng kiểu number cho longitude

    @IsNotEmpty()
    @ApiProperty({ type: PeekDTO, isArray: true }) // Sử dụng PeekDTO và isArray: true
    peeks: PeekDTO[];
}

