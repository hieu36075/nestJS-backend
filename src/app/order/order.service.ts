import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class OrderService{
    constructor(
        private prismaService: PrismaService
    ){}

    async getOrder(page:number, perPage:number): Promise<PaginationResult<Order>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data =  await this.prismaService.order.findMany({
            skip,
            take,
        })
        const meta = { page, perPage, totalItems, totalPages };

        return {data, meta}
    }

    async getOrderById(orderId: string): Promise<Order | null>{
        const order = await this.prismaService.order.findUnique({
            where:{
                id: orderId
            }
        });
        if(order){
            throw new ForbiddenException("Plase Check Again")
        }
        return order;
    }

    async getOrderByUser(userId: string, page: number, perPage: number): Promise<PaginationResult<Order>> {
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data = await this.prismaService.order.findMany({
            where: {
                userId: userId
            }
        });

        const meta = { page, perPage, totalItems, totalPages };

        return {data, meta}
    }
}