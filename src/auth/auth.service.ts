import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDTO } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Role } from "@prisma/client";

@Injectable({})
export class AuthService{
    constructor(
        private prismaService : PrismaService,
        private jwtService : JwtService,
        private configService: ConfigService,
    ){
        
    }
    async register(authDTO : AuthDTO){
        const hashedPassword = await argon.hash(authDTO.password)
        try{
            const user = await this.prismaService.user.create({
                data:{
                    email: authDTO.email,
                    hashedPassword: hashedPassword,
                    name: '',             
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
            
            // select:{
            //     id: true,
            //     email: true,
            //     role: true,
            //     hashedPassword: true,
            //     roleId: true,
            //     profile: true,
            // }
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

    async viewRole() : Promise<Role[]>{
        return await this.prismaService.role.findMany()
        
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