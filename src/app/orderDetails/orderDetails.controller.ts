import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('orderDetails')
@ApiTags('OrderDetail')
export class OrderDetailsController{
    constructor(){

    }
}
