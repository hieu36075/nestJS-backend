import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { MyJwtGuard } from "./guard";
@Controller('auth')
@ApiTags('Auth')

export class AuthController {
    constructor(private authService : AuthService){

    }

    @Get('role')
    getRole(){
        return this.authService.viewRole();
    }

    @Post("register",) 
    register(@Body() authDTO:AuthDTO){
        
        return this.authService.register(authDTO);
    }

    @Post('login',)
    login(@Body() authDTO:AuthDTO){
        return this.authService.login(authDTO);
    }
    
    
}