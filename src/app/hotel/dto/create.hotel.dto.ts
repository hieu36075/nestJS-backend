import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

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

}

