import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Profile, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { SocketGateway } from 'src/providers/socket/socket.gateway';
import { PaginationResult } from 'src/common/interface/pagination.interface';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly redisService: RedisService,
    private socketGateway: SocketGateway,
  ) {}

  async getUser(page:number, perPage: number): Promise<PaginationResult<User>> {
    const totalItems = await this.prismaService.user.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.user.findMany({
      where:{
        role:{
          name:{
            not:'Admin'
          }
        }
      },
      include: {
        profile: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    data.forEach((user) => {
      delete user.hashedPassword;
    });

    const meta = { page, perPage, totalItems, totalPages };
    return { data, meta };
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include:{
        role:{
          select: {
            name:true
          }
        }
      }
    });
    if (!user) {
      throw new NotFoundException('Cannot find user with the provided ID');
    }
    delete user.hashedPassword;
    delete user.hashedRt;
    // this.socketGateway.sendNotification(user.id, 'getUser', 'test 1');
    return user;
  }

  async createProfile():Promise<Profile>{
    return 
  }

  async getUsersCountThisAndLastMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);

    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0);

    const usersThisMonth = await this.prismaService.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lt: currentMonthEnd,
        },
      },
    });

    const usersLastMonth = await this.prismaService.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd,
        },
      },
    });

    return {
      usersThisMonth,
      usersLastMonth,
    };
  }

  async bandAccount(id:string):Promise<User>{
    const checkId = await this.prismaService.user.findUnique({
      where:{
        id:id
      }
    })
    if(!checkId){
      throw new NotFoundException('Not found id')
    }
    return await this.prismaService.user.update({
      where:{
        id : id
      },
      data:{
        isActive: false
      },
      include:{
        role:{
          select:{
            name:true
          }
        }
      }
    })
  }

  

}
