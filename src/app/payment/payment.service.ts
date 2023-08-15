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
          const paymentIntent = await this.stripeService.createPaymentIntent(paymentDTO.amount,paymentDTO.currency);
          return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
          throw new Error('Error creating payment intent');
        }
      }
}