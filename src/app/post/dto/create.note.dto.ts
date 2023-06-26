import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from "class-validator"

export class CreatePostDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    content: string 

    @IsDefined()
    @IsBoolean()
    @ApiProperty({
        example: false
    })
    published: boolean 

}

