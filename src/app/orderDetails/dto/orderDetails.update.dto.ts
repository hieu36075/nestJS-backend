import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class UpdateOrderDetailsDTO{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    orderId?: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    price?: number
    


}

