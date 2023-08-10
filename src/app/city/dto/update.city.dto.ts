import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class UpdateCitylDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    countryId?: string

}

