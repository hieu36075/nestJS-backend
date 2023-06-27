import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDTO } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Role } from "@prisma/client";
import { MailService } from "src/providers/mail/mail.service";
import { GoogleAuthDTO } from "./dto/googleAuth.dto";

@Injectable({})
export class AuthService{
    constructor(
        private prismaService : PrismaService,
        private jwtService : JwtService,
        private configService: ConfigService,
        private mailService : MailService
    ){
        
    }
    async register(authDTO : AuthDTO){
        const hashedPassword = await argon.hash(authDTO.password)
        try{
            const user = await this.prismaService.user.create({
                data:{
                    email: authDTO.email,
                    hashedPassword: hashedPassword,  
                    roleId: 'clgywq0h8000308l3a38y39t6'
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    createdAt: true,
                    role: true
                }
            })
            return user
        }catch(error){
            if(error.code == 'P2002'){
                throw new ForbiddenException('Email already exist ')
            }
        }
    }

    async login(authDTO : AuthDTO){
      
        const user = await this.prismaService.user.findUnique({
            where:{
                email: authDTO.email
            },
            include: {
                role: true,
            }
            
        })
        if(!user){
            throw new ForbiddenException('User not found')
        }
        const verifyPassword = await argon.verify(
            user.hashedPassword,
            authDTO.password
        )
        if(!verifyPassword){
            throw new ForbiddenException('Wrong Password')
        }

        delete user.hashedPassword
        // return user
        // console.log(user)
        return  await this.createJwtToken(user.id , user.email , user.role.name)

    }


    async createJwtToken(userId: string, email: string, roles: string): Promise<{accessToken: string}>{
        const payload = {
            id: userId,
            email,
            roles,
        }
        const jwtString =  await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET')
            
        })
        return{
            accessToken: jwtString,
        }
    }

    async validateUser(authDTO: GoogleAuthDTO) {
        console.log('AuthService');
        // console.log(authDTO);
        const user = await this.prismaService.user.findUnique({
            where:{
                email: authDTO.email
            }
        })
        console.log(user);
        if (user) return user;
        console.log('User not found. Creating...');
        const newUser = this.prismaService.user.create({
            data:{
                email: authDTO.email,
                roleId: "clgywq0h8000308l3a38y39t6",
                googleAccount:{
                    create:{
                        token: "a",
                        refreshToken: "b"
                    }
                }
            }
        })
        return newUser
      }
    
    async findUser(id: string) {
        const user = await this.prismaService.user.findUnique({
            where:{
                id: id
            }
        })
        delete user.hashedPassword;
        return user;
    }  


    async viewRole() : Promise<Role[]>{
        return await this.prismaService.role.findMany()
        
    }

    async sendEmail(){
        return await this.mailService.sendEmail("longqb08122001@gmail.com", "hieutcgcd191045@fpt.edu.vn", "Hello Long ngu ", "Vào thư rác k ? ")
    }
    
    // async forgetPassword(authDTO : AuthDTO)
    // {
    //     const user = await this.prismaService.user.findUnique({
    //         where:{
    //             email: authDTO.email
    //         }
    //     })


    // }
}