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

}