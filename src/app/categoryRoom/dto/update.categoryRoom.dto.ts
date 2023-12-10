import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { CreateCategoryRoomDTO } from "./create.categoryRoom.dto";

export class UpdateCategoryRoomDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string

    @ApiProperty()
    name?: string

    @ApiProperty()
    numberOrBeds?: number
}