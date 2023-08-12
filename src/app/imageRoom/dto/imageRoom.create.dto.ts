import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"


export class CreateImageRoomDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    url: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    roomId: string

}

