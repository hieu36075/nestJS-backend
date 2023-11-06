import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { OrderDetails } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateOrderDetailsDTO } from "./dto/orderDetails.create.dto";
import { UpdateOrderDetailsDTO } from "./dto/orderDetails.update.dto";

@Injectable()
export class OrderDetailsService{
    constructor(
        private prismaService: PrismaService
    ){}
    
    
    async createOrderDetail(createOrderDetaislDTO: CreateOrderDetailsDTO):Promise<OrderDetails>{
        return this.prismaService.orderDetails.create({
            data:{
                ...createOrderDetaislDTO
            }
        })
    }
    
    async updateOrderDetails(updateOrderDetailsDTO: UpdateOrderDetailsDTO) : Promise<OrderDetails>{
        try{
            const orderDetails = await this.prismaService.orderDetails.findFirst({
                where:{
                    orderId: updateOrderDetailsDTO.orderId
                }
            })
            if(!orderDetails){
                throw new ForbiddenException("Don't Have Id")
            }
            const newOrderDetails =  this.prismaService.orderDetails.update({
                where:{
                    id: orderDetails.id
                },
                data:{
                    ...updateOrderDetailsDTO
                }
            })
            return newOrderDetails
        }catch(error){
            throw new Error(error)
        }
    }

    async checkDateByRoom(roomId: string) : Promise<OrderDetails[]>{
        const room = await this.prismaService.room.findUnique({
            where:{
                id: roomId
            }
        })

        if(!room){
            throw new NotFoundException("Don't have Id")
        }
        
        return await this.prismaService.orderDetails.findMany({
            where: {
              room: {
                id: roomId
              },
              oder:{
                status: 'DONE'
              }
            },
            include: {
              oder: {
                select: {
                  checkIn: true,
                  checkOut: true
                }
              }
            }
          });
        
    }
}