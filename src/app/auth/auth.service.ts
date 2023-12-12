import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { MailService } from 'src/providers/mail/mail.service';
import { S3Service } from 'src/providers/aws s3/aws.s3.service';
import { createOAuth2Client } from 'src/config/google/oauth2.config';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import { SocketGateway } from 'src/providers/socket/socket.gateway';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Tokens } from './types/token.types';
import { String } from 'aws-sdk/clients/appstream';
import { ProfileService } from '../profile/profile.service';
import { RegisterDTO } from './dto/register.dto';
import { PasswordDTO } from './dto/password.dto';


@Injectable({})
export class AuthService {
  private readonly client: OAuth2Client;
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisService,
    private  profileService:ProfileService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private s3Service: S3Service,

  ) {
    this.client = createOAuth2Client();
  }
  async register(registerDTO: RegisterDTO) : Promise<any> {
    const {email, password, userName, ...registerData } = registerDTO
    const hashedPassword = await argon.hash(registerDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: registerDTO.email,
          hashedPassword: hashedPassword,
          roleId: 'clgywq0h8000308l3a38y39t6',
          userName: registerDTO.userName
        },
        select: {
          id: true,
          userName: true,
          email: true,
          createdAt: true,
          role: true,
        },
      });
      await this.profileService.createProfile(user.id, registerData)
      this.mailService.sendEmail(user.email, 
        'hieutcgcd191045@fpt.edu.vn', 
        'You have created a travel account', 
        'Thanks for service')
      return await this.createJwtToken(user.id, user.email, user.role.name);
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('Email already exist ');
      }
    }
  }

  async login(authDTO: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
        isActive: true
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!user.hashedPassword) {
      throw new ForbiddenException('password wrong');
    }
    const verifyPassword = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );
    if (!verifyPassword) {
      throw new ForbiddenException('Wrong Password');
    }

    delete user.hashedPassword;

    const token =  await this.createJwtToken(user.id, user.email, user.role.name);
    await this.updateRtHash(user.id, token.refresh_token)
    return token
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: {
          select: {
            name: true
          }
        }
      }
    });
  
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
  
    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
  
    const tokens = await this.createJwtToken(user.id, user.email, user.role.name);
    await this.updateRtHash(user.id, tokens.refresh_token);
  
    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prismaService.user.update({
      where:{
        id: userId
      },
      data:{
        hashedRt: hash,
      }
    })
    // await this.prismaService.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     hashedRt: hash,
    //   },
    // });
  }

  async createJwtToken(
    userId: string,
    email: string,
    roles: string,
  ): Promise<Tokens> {
    const payload = {
      id: userId,
      email,
      roles,
    };


    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async verifyGoogleIdToken(token: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    const user = await this.loginGoogle(email, name, picture);

    return await this.createJwtToken(user.id, user.email, user.role.name);
  }

  async loginGoogle(
    email: string,
    name: string,
    picture: string,
  ): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          userName: name,
          roleId: 'clgywq0h8000308l3a38y39t6',
          profile: {
            create: {
              fullName: 'Nguyen A',
              firstName: 'Nguyen',
              lastName: 'a',
              avatarUrl: picture,
            },
          },
        },
        include: {
          role: true,
        },
      });
      return newUser;
    }
    if(!user.isActive){
      throw new ForbiddenException('Please Contact Admin')
    }
    return user;
  }

  async switchRole(id: string) :Promise<any>{
    const user = await this.prismaService.user.findUnique({
      where:{
        id: id
      },
      include:{
        role:true
      }
    })
    if(!user){
      throw new NotFoundException('Please check again')
    }
    let newuser : any 
    if(user.role.name === 'User'){
      newuser = await this.prismaService.user.update({
        where:{
          id: user.id
        },
        data:{
          role:{
            connect:{
              id: 'clgywqlp0000408l38j7zarnn'
            },
          },
        },
        include:{
          role:true
        }
      })
    }else{
      newuser = await this.prismaService.user.update({
        where:{
          id: user.id
        },
        data:{
          role:{
            connect:{
              id: 'clgywq0h8000308l3a38y39t6'
            },
          },
        },
        include:{
          role:true
        }
      })
    }
    
    return await this.createJwtToken(newuser.id, newuser.email, newuser.role.name)
  }
  async viewRole(): Promise<Role[]> {
    return await this.prismaService.role.findMany();
  }

  async sendEmail() {
    return await this.mailService.sendEmail(
      'longqb08122001@gmail.com',
      'hieutcgcd191045@fpt.edu.vn',
      'Hello Long  ',
      'Vào thư rác k ? ',
    );
  }

  async resetPassword(email : string){
    const randomNumber = Math.floor(Math.random() * 1000000);
    const randomString = randomNumber.toString().padStart(6, '0');
    const user = await this.prismaService.user.findUnique({
      where:{
        email: email
      }
    })
    
    if(!user){
      throw new ForbiddenException('Not Found')
    }
    const password = await argon.hash(randomString);
    await this.prismaService.user.update({
      where:{
        email: email
      },
      data:{
        hashedPassword: password
      }
    })

    return await this.mailService.sendEmail(
      `${email}`,
      'hieutcgcd191045@fpt.edu.vn',
      'Reset PassWord TravelVietNam',
      `Your new password is ${randomString}`,
    );
  }

  async changePass(id:string, passwordDTO : PasswordDTO){
    const user = await this.prismaService.user.findUnique({
      where:{
        id: id
      }
    })
    
    const verifyPassword = await argon.verify(
      user.hashedPassword,
      passwordDTO.password,
    );
    if (!verifyPassword) {
      throw new ForbiddenException('Wrong Password');
    }
    const newPass = await argon.hash(passwordDTO.newPassword);
    return await this.prismaService.user.update({
      where:{
        id: id
      },
      data:{
        hashedPassword: newPass
      },
    })
  }
  async upload(file: any) {
    return await this.s3Service.uploadFile(file, 'avatar/a/');
  }

  async multiUpload(files: Express.Multer.File[]): Promise<string[]> {
    return this.s3Service.uploadMultipleFiles(files, 'test/');
  }

  



}
