import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService{
    private stripe : Stripe;
    constructor(
        private readonly configService: ConfigService
    ){
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2022-11-15'
        });
    }

    async createPaymentIntent(amount: number, currency: string) {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount,
          currency,
        });
        return paymentIntent;
      }
}