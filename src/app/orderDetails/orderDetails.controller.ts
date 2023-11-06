import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderDetailsService } from "./orderDetails.service";

@Controller('orderDetails')
@ApiTags('OrderDetail')
export class OrderDetailsController{
    constructor(
        private orderDetailsService: OrderDetailsService
    ){
    
    }

    @Get('checkDateByRoom/:id')
    async test(@Param('id') id: string){
        return await this.orderDetailsService.checkDateByRoom(id)
    }
}
