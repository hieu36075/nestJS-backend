import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { Order } from "@prisma/client";
import { GetUser } from "src/common/decorator/user.decorator";
import { Roles } from "src/common/decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { CreateOrderDTO } from "./dto/order.create.dto";
import { Public } from "src/common/decorator/public.decorator";
import { UpdateOrderDTO } from "./dto/order.update.dto";

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)

export class OrderController{
    constructor(
        private orderService: OrderService
    ){}
    
    @Public()
    @Get()
    async getOrder(
        @Query('page') page: number,
        @Query('perPage') perPage: number
        ) 
        : Promise<PaginationResult<Order>> {
        return await this.orderService.getOrder(page, perPage);
    }


    // @Public()
    @Get("getByUserId")
    async getOrderByUserId(
        @GetUser('id') userId: string, 
        @Query('page') page: number,
        @Query('perPage') perPage:number): Promise<PaginationResult<Order>>{
        return await this.orderService.getOrderByUser(userId, page, perPage)
    }
    

    @Public()
    @Get('order-in-month')
    async getOrderInMonth() : Promise<{ thisMonth: number; lastMonth: number }>{
        return await this.orderService.getTotalOrdersInMonths();
    }

    @Public()
    @Get('earnings-in-months')
    async getEarningInMonths(){
        return await this.orderService.getTotalEarningsInMonths();
    }
    @Public()
    @Get('monthly-revenues')
    async getMonthlyRevenuesLast6Months() {
      const monthlyRevenues = await this.orderService.getMonthlyRevenuesLast6Months();
      return monthlyRevenues;
    }

    @Public()
    @Get('total-revenues')
    async getTotalRevenues() {
      const totalRevenues = await this.orderService.getTotalRevenues();
      return totalRevenues;
    }

    @Public()
    @Get(':id')
    async getOrderById(@Param('id') orderId:string): Promise<Order>{
        return await this.orderService.getOrderById(orderId)
    }

    @Post()
    async createOrder(@GetUser('id') userId:string, @Body() createOrderDTO: CreateOrderDTO): Promise<Order>{
    //    console.log(createOrderDTO)
        return await this.orderService.createOrder(userId, createOrderDTO);
    }
    
    @Patch()
    async updateOrder(@Query('id') orderId: string,@Body() updateOrderDTO:UpdateOrderDTO): Promise<Order>{
        return await this.orderService.updateOrder(orderId,updateOrderDTO);
    }

    @Patch('confirm-order/:id')
    async confirmOrder(@GetUser('id') userId: string, @Param('id') orderId: string): Promise<Order>{
        return await this.orderService.confirmOrder(userId, orderId)
    }
}