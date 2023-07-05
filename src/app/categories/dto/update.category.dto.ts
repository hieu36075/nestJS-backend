import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator"

export class UpdateCategoryDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    imageURL?: string 

}

