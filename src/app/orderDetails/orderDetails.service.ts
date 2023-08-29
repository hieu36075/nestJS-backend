import { Body, Injectable } from "@nestjs/common";
import { OrderDetails } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateOrderDetailsDTO } from "./dto/orderDetails.create.dto";

@Injectable()
export class OrderDetailsService{
    constructor(
        private prismaService: PrismaService
    ){}
    
    
    async createOrderDetail(@Body() createOrderDetaislDTO: CreateOrderDetailsDTO):Promise<OrderDetails>{
        return this.prismaService.orderDetails.create({
            data:{
                ...createOrderDetaislDTO
            }
        })
    }
}