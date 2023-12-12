import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class GetHotelFilterDTO{
    @IsString()
    name?: string

    @IsString()
    address?: string 

    @IsString()
    countryId?: string

    @IsInt()
    @Min(0)
    @Max(5)
    starRating? : number

    @IsString()
    categoryId?: string

    @ApiProperty({ example: 2, description: 'The minimum occupancy required' })
    @IsInt()
    @Min(1)
    occupancy?: number;
  
    @ApiProperty({ example: 100, description: 'The maximum price per night' })
    @IsInt()
    @Min(1)
    minPrice?: number;

    @ApiProperty({ example: 100, description: 'The maximum price per night' })
    @IsInt()
    @Min(1)
    maxPrice?: number;

    @ApiProperty()
    checkIn?: string;

}