import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class UpdateCommentDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description?: string
    
}

