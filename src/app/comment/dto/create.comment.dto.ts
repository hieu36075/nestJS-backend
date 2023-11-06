import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class CreateCommentDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hotelId : string

}

