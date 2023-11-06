import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { StripeService } from "src/providers/stripe/stripe.service";
import { PaymentDTO } from "./dto/payment.dto";
import { SocketGateway } from "src/providers/socket/socket.gateway";

@Injectable()
export class PaymentService{
    constructor(
        private prismaService: PrismaService,
        private stripeService: StripeService,
        private socketGateway: SocketGateway
    ){}

    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {
        try {
          const existingPaymentIntent = await this.stripeService.getPaymentIntentByOrderId(paymentDTO.orderId);
          const checkOrder = await this.prismaService.order.findUnique({
            where:{
              id: paymentDTO.orderId,
              status:{
                not: 'DONE'
              }
            }
          })
          if(!checkOrder){
            throw new ForbiddenException('Invalid id')
          }
          if(existingPaymentIntent){
            if(existingPaymentIntent.status === 'requires_payment_method')
            await this.updatePaymentIntent(existingPaymentIntent.id, paymentDTO.amount)
            return {clientSecret: existingPaymentIntent.client_secret}
          }
          const paymentIntent = await this.stripeService.createPaymentIntent(paymentDTO.amount,paymentDTO.currency, paymentDTO.orderId);
          return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
          console.error("Error creating payment intent:", error);
          throw new Error('Error creating payment intent');
        }
      }
    
    async deletePaymentIntent(id: string){
      try {
        await this.stripeService.cancelPaymentIntent(id);
        return { message: 'Payment intent canceled successfully' };
      } catch (error) {
        throw new Error('Error canceling payment intent');
      }
    }

    async updatePaymentIntent(paymentIntentId: string, amount: number){
      try{
        const updatePaymentIntent = await this.stripeService.updatePaymentIntentPrice(paymentIntentId, amount)
        return updatePaymentIntent
      }catch(error){
        throw new Error(`Error update faild: ${error.message}`)
      }
    }


    async confirmPaymentIntent(userId: string, orderId:string){
      try {
        const order = await this.prismaService.order.update({
          where:{
            id: orderId
          },
          data:{
            status:'DONE'
          },
          include:{
            hotel:{
              select:{
                userId:true
              }
            },
            orderdetails:{
              select:{
                roomId:true
              }
            }
          }
        })
        await this.prismaService.room.update({
          where:{
            id: order.orderdetails[0].roomId
          },
          data:{
            status: 'BOOKED',
          }
        })
        const user = await this.prismaService.profile.findUnique({
          where:{
            userId: userId
          }
        })
        const hotel = await this.prismaService.hotel.findUnique({
          where:{
            id: order.hotelId
          }
        })
        
        // await this.socketGateway.sendNotification(userId, 'Booking', `Bạn  da dat khach san thanh cong`)
        // await this.socketGateway.sendNotification(hotel.id, 'Booking', `${user.fullName}đã đặt khách sạn của bạn `)
        
        return order
      } catch (error) {
        throw new Error(error)
      }
    }
}