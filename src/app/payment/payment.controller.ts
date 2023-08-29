import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiTags } from "@nestjs/swagger";
import { PaymentDTO } from "./dto/payment.dto";
import { ConfirmPaymentDTO } from "./dto/confirm.payment.dto";
import { UpdatePaymentIntentDTO } from "./dto/update.payment.dto";
@Controller('payment')
@ApiTags('Payment')
export class PaymentController{
    constructor(
        private paymentService: PaymentService
    ){}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() paymentDTO: PaymentDTO) {
        // console.log(paymentDTO)
        return await this.paymentService.createPaymentIntent(paymentDTO);
    }

    // @Post('confirm')
    // async confirmPayment(@Body() confirmPaymentDTO: ConfirmPaymentDTO) {
    //   try {
    //     const confirmedPayment = await this.paymentService.confirmPaymentIntent(confirmPaymentDTO.paymentIntentId);
    //     return { message: 'Payment confirmed successfully', payment: confirmedPayment };
    //   } catch (error) {
    //     return { message: 'Error confirming payment', error: error.message };
    //   }
    // }

    @Patch(':paymentIntentId')
    async updatePaymentIntent(@Param('paymentIntentId')paymentIntentId: string, @Body() updatePaymentDTO: UpdatePaymentIntentDTO ){
      try {
        await this.paymentService.updatePaymentIntent(paymentIntentId, updatePaymentDTO.amount);
        return { message: 'Payment intent updated successfully' };
      } catch (error) {
        return { message: 'Error updating payment intent', error: error.message };
      }
    }

    @Delete('cancal-intent/:id')
    async cancelPaymentIntent(@Param('id') paymentIntentId: string){
        return await this.paymentService.deletePaymentIntent(paymentIntentId);
    }
}