import { Body, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { StripeService } from "src/providers/stripe/stripe.service";
import { PaymentDTO } from "./dto/payment.dto";

@Injectable()
export class PaymentService{
    constructor(
        private prismaService: PrismaService,
        private stripeService: StripeService
    ){}

    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {
        try {
          const existingPaymentIntent = await this.stripeService.getPaymentIntentByOrderId(paymentDTO.orderId);
          if(existingPaymentIntent){
            if(existingPaymentIntent.status === 'requires_payment_method')
            console.log("A")
            return {clientSecret: existingPaymentIntent.client_secret}
          }
          console.log("cut cmnr")
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
      }catch(error){
        throw new Error(`Error update faild: ${error.message}`)
      }
    }


    // async confirmPaymentIntent(id:string){
    //   try {
    //     await this.stripeService.confirmPaymentIntent(id);
    //     return { message: 'Payment intent confirm successfully' };
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // }
}