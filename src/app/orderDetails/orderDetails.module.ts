import { Module } from "@nestjs/common";
import { OrderDetailsController } from "./orderDetails.controller";
import { OrderDetailsService } from "./orderDetails.service";

@Module({
    imports:[],
    controllers:[OrderDetailsController],
    providers:[OrderDetailsService]
})

export class OrderDetailsModule {};