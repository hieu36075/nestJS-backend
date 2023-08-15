import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiTags } from "@nestjs/swagger";
import { PaymentDTO } from "./dto/payment.dto";

@Controller('payment')
@ApiTags('Payment')
export class PaymentController{
    constructor(
        private paymentService: PaymentService
    ){}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {
        console.log(paymentDTO)
        return await this.paymentService.createPaymentIntent(paymentDTO);
    }
}