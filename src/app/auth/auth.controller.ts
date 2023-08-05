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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyJwtGuard } from 'src/common/guard';
import { Role } from '@prisma/client';
import { MailService } from 'src/providers/mail/mail.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('role')
  async getRole(): Promise<Role[]> {
    return await this.authService.viewRole();
  }

  @Post('register')
  register(@Body() authDTO: AuthDTO) {
    return this.authService.register(authDTO);
  }

  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }

  @Post('login/google')
  async loginByGoogle(@Body('token') token: string): Promise<any> {
    const ticket = await this.authService.verifyGoogleIdToken(token);
    return ticket;
  }

  @Get('mail')
  async sendMail() {
    return this.authService.sendEmail();
  }

  @Post('file-upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
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
