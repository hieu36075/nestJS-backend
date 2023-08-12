import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class CreateCountryDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    image : string
}

