import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator"

export class CreateOrderDetailsDTO{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    orderId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    roomId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    price : number
    


}

