import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator"

export class CreateCategoryDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    imageURL: string 

}

