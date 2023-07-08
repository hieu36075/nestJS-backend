import { Body, ForbiddenException, Injectable, NotFoundException, Query } from "@nestjs/common";
import { Post, User } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";



@Injectable()
export class UserService{
    constructor(
        private prismaService: PrismaService,
        ){
    }

    async getUser(): Promise<User[]> {
        const users = await this.prismaService.user.findMany({
            include:{
                profile:true
            }
        });
        // const sanitizedUsers = users.map(user => Object.assign({}, user, { hashedPassword: undefined }));
        users.forEach(user => {
            delete user.hashedPassword;
          });
        return users;
      }

    async getUserById(userId : string): Promise<User>{
        const user = await this.prismaService.user.findUnique({
            where:{
                id: userId
            }
        })
        if(!user){
            throw new NotFoundException("Cannot find user with the provided ID");
        }
        delete user.hashedPassword
        return user
    }

}
