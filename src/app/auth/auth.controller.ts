import { Controller, Post, Body, Get, UseGuards, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { MyJwtGuard } from "src/common/guard";
import { Role } from "@prisma/client";
import { MailService } from "src/providers/mail/mail.service";
@Controller('auth')
@ApiTags('Auth')

export class AuthController {
    constructor(
        
        private authService : AuthService,
       
        ){

    }

    @Get('role')
    async getRole() : Promise<Role[]>{
        return await this.authService.viewRole();
    }

    @Post("register",) 
    register(@Body() authDTO:AuthDTO){
        
        return this.authService.register(authDTO);
    }

    @Post('login',)
    login(@Body() authDTO:AuthDTO){
        return this.authService.login(authDTO);
    }
    
    @Get('mail')
    async sendMail(){
        return this.authService.sendEmail()
    }
    
}