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

    async createPaymentIntent(amount: number, currency: string, orderId: string) {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount,
          currency,
          metadata:{
            order_id: orderId
          }
        });
        return paymentIntent;
    }
    
    async updatePaymentIntentPrice(paymentIntentId: string, newAmount: number) {
        try {
            const updatedPaymentIntent = await this.stripe.paymentIntents.update(paymentIntentId, {
                amount: newAmount,
            });
    
            return updatedPaymentIntent;
        } catch (error) {
            throw new Error(`Error updating payment intent: ${error.message}`);
        }
    }


    async cancelPaymentIntent(paymentIntentId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            throw new Error(`Error canceling payment intent: ${error.message}`);
        }
    }

    async getPaymentIntentByOrderId(orderId: string) {
        try {
            const paymentIntents = await this.stripe.paymentIntents.list({
                limit: 100, // Số lượng payment intent tối đa muốn lấy (có thể điều chỉnh)

            });
    
            const paymentIntentWithOrderId = paymentIntents.data.find(paymentIntent => 
                paymentIntent.metadata.order_id === orderId
            );
    
            return paymentIntentWithOrderId;
        } catch (error) {
            throw new Error(`Error fetching payment intents: ${error.message}`);
        }
    }

    async confirmPaymentIntent(paymentIntentId: string) {
        try {
          const confirmedPayment = await this.stripe.paymentIntents.confirm(paymentIntentId);
          return confirmedPayment;
        } catch (error) {
          throw new Error(`Error confirming payment intent: ${error.message}`);
        }
      }
}