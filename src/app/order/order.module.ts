import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderDetailsService } from "../orderDetails/orderDetails.service";

@Module({
    imports:[],
    controllers:[OrderController],
    providers:[OrderService, OrderDetailsService]
})

export class OrderModule {};