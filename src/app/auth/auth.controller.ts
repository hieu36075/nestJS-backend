import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Req,
  Res,
  Redirect,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyJwtGuard } from 'src/common/guard';
import { Role } from '@prisma/client';
import { MailService } from 'src/providers/mail/mail.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorator/user.decorator';
import { GetRefreshToken } from 'src/common/decorator/token.decorator';
import { RtStrategy } from 'src/common/strategy/rt.strategy';
import { Public } from 'src/common/decorator/public.decorator';
import { Tokens } from './types/token.types';
import { RtGuard } from 'src/common/guard/rt.guard';
import { RegisterDTO } from './dto/register.dto';
import { ResetPasswordDTO } from './dto/resetPassword.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('role')
  async getRole(): Promise<Role[]> {
    return await this.authService.viewRole();
  }

  @Public()
  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Public()
  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
  
  @Public()
  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO){
    return this.authService.resetPassword(resetPasswordDTO.email)
  }
  @Public()
  @Post('login/google')
  async loginByGoogle(@Body('token') token: string): Promise<any> {
    const ticket = await this.authService.verifyGoogleIdToken(token);
    return ticket;
  }

  @Patch('update-role')
  async updateRole(@GetUser('id') id:string): Promise<any>{
    return await this.authService.switchRole(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(@GetUser('id') userId:string , @GetRefreshToken('refreshToken') refreshToken: string) : Promise<Tokens>{
    return await this.authService.refreshTokens(userId, refreshToken) 
  }


  @Get('mail')
  async sendMail() {
    return this.authService.sendEmail();
  }
  @Public()
  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return this.authService.upload(file);
  }

  @Post('/multiple-file-upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return await this.authService.multiUpload(files);
  }
}
