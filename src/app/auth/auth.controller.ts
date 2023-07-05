import { Controller, Post, Body, Get, UseGuards, Query, Req, Res, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { MyJwtGuard } from "src/common/guard";
import { Role } from "@prisma/client";
import { MailService } from "src/providers/mail/mail.service";
import { GoogleAuthGuard } from "src/common/guard/mygoogle.guard";

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

    
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(){

    }

    
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    // @Redirect('http://localhost:3000', 301)
    async googleRedirect(@Req() req, @Res() res: Response){
        const user = req.user
        const token = this.authService.createJwtToken(user.id, user.email, user.role.name)
        console.log(req.host)
        return token;
        
    }


    @Get('mail')
    async sendMail(){
        return this.authService.sendEmail()
    }
    
}