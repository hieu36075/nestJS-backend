import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MyJwtGuard } from "src/auth/guard";


@Controller('users')
@ApiTags('User')
@ApiBearerAuth('JWT-auth')
export class UserController{
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(MyJwtGuard)
    @Get('me')
    me(){
        return "duoc r thang ngu ";
    }
}