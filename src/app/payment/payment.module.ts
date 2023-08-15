import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { StripeService } from "src/providers/stripe/stripe.service";

@Module({
    imports:[],
    controllers:[PaymentController],
    providers:[PaymentService, StripeService]
})
export class PaymentModule{}