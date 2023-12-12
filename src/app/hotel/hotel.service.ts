import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Country, Hotel, OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateHotelDTO } from './dto/create.hotel.dto';
import { UpdateHotelDTO } from './dto/update.hotel.dto';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { GetHotelFilterDTO } from './dto/getfilter.hotel.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { S3Service } from 'src/providers/aws s3/aws.s3.service';
import * as moment from 'moment';
import { SocketGateway } from 'src/providers/socket/socket.gateway';

@Injectable()
export class HotelService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
    private socketGateway: SocketGateway
    ) {}

  async getHotel(
    page: number,
    perPage: number,
  ): Promise<PaginationResult<Hotel>> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.hotel.findMany({
      where:{
        isActive: true
      },
      skip,
      take,
      include: {
        categoryRooms: true,
        comments: true,
        amenities: true,
        images: {
          select: {
            url: true,
          },
        },
        rooms:{
          select:{
            name:true,
            price:true
          }
        }
      },
    });

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }
  
  async activeHotel(hotelId: string): Promise<Hotel |null>{
    const hotel = await this.prismaService.hotel.findUnique({
      where:{
        id:hotelId
      }
    })
    if(!hotel){
      throw new NotFoundException('Please check again')
    }

    const update =  await this.prismaService.hotel.update({
      where:{
        id: hotelId
      },
      data:{
        isActive: true
      },
      include:{
        images:true
      }
    })
    await this.socketGateway.sendNotification(
      hotel.userId, 
      'Create hotel succesful, click here to view', 
      'action_create_hotel', 
      hotel.id)
    return update
  }

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    try{
      const hotel = await this.prismaService.hotel.findUnique({
          where: {
          id: hotelId, 
          
        },
        include: {
          images: true,
          amenities:true,
          city:{
            select:{
              name:true,
            },
          },
          country:{
            select:{
              name: true,
            }
          },
          categoryRooms: true,
          rooms:{
            where:{
              status: 'AVAILABLE'
            },
            orderBy:{
              price: 'asc',
            },
            include:{
              imageRoom:true,
            },
            take:1
          }
        },
      });

      if (!hotel) {
        throw new ForbiddenException('Invalid Id ');
      }
      
      return hotel;
    }catch(error){
      throw new Error(error)
    }
  }

  async createHotel(id:string,  createHotelDTO: CreateHotelDTO): Promise<Hotel> {
    const { peeks, ...hotelData } = createHotelDTO;
    const user = await this.prismaService.user.findUnique({
      where:{
        id: id
      }
    })
    if(!user){
      throw new ForbiddenException('Not Found')
    }
    const peeksDataPromises = peeks.map(async (peek) => {
      return this.prismaService.amenity.findUnique({
        where: {
          id: peek.id,
        },
      });
    });
    const peeksData = await Promise.all(peeksDataPromises);
    
    const hotel =  await this.prismaService.hotel.create({
      data: {
        ...hotelData,
        userId:id,
        isActive:false,
        amenities: {
          connect: peeksData, // Kết nối với danh sách peeksData
        },
      },
    });
    // await this.socketGateway.sendNotification(hotel.userId, 'Create Hotel Succces')
    return hotel
  }
  

  async updateHotel(
    hotelId: string,
    @Body() updateHotelDTO: UpdateHotelDTO,
  ): Promise<Hotel> {
    const hotel = await this.prismaService.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!hotel) {
      throw new ForbiddenException('Cannot find Hotel in Database');
    }

    return this.prismaService.hotel.update({
      where: {
        id: hotelId,
      },
      data: {
        ...updateHotelDTO,
      },
    });
  }

  async deleteHotel(hotelId: string): Promise<void> {
    await this.prismaService.hotel.delete({
      where: {
        id: hotelId,
      },
    });
  }

  async getHotelByCountry(countryId: string): Promise<any> {
    return await this.prismaService.hotel.findMany({
      where: {
        countryId: countryId,
        isActive: true
      },
      include: {
        images: true,
      },
    });
  }
  
  async getHotelByRoom(hotelId: string ,roomId: string) : Promise<Hotel>{
    return await this.prismaService.hotel.findUnique({
      where:{
        id: hotelId,
        isActive: true,
        rooms:{
          some:{
            id: roomId
          }
        }
      },
      include:{
        images:true
      }
    })
  }


  async getHotelByCategory(categoryId: string): Promise<any> {
    return await this.prismaService.hotel.findMany({
      where: {
        categoryId: categoryId,
        isActive: true
      },
      include: {
        images: true,
      },
    });
  }

  async getHotelByUser(id: string, page: number , perPage: number): Promise<PaginationResult<Hotel>>{
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.hotel.findMany({
      where:{
        userId: id
      },include:{
        rooms:{
          take:1
        },
        categoryRooms:{
          take:1
        },
        images:{
          take:1
        }
      },
      skip,
      take
    })

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }

  async filterHotelByUserId(id: string, active:boolean) : Promise<Hotel[]>{
    return await this.prismaService.hotel.findMany({
      where:{
        userId:id,
        isActive: active
      },
      include:{
        rooms:{
          take:1
        },
        images:{
          take:1
        }
      }
    })
  }


  async multiUpload(files: Express.Multer.File[]): Promise<string[]> {
    return this.s3Service.uploadMultipleFiles(files, 'hotels/');
  }

  async getHotelByRoomId(hotelId: string, roomId: string):Promise<Hotel>{
    try {
      const hotel = await this.prismaService.hotel.findUnique({
        where:{
          id: hotelId
        },
        include:{
          rooms:{
            where:{
              id: roomId,
            }
          },
          images:{
            take:1
          }
        }
      })
      return hotel
    } catch (error) {
      throw new Error(error)
    }
  }


  async getHotelByFilter(getHotelByFilter: GetHotelFilterDTO): Promise<any> {
    try {
      const where = this.buildFilterConditions(getHotelByFilter);
      return await this.prismaService.hotel.findMany({
        where,
        include: {
          images: true,
          rooms:{
            where:{
              status: 'AVAILABLE',
              ...where.rooms?.some,
            },
            orderBy:{
              price: 'asc'
            },
            select:{
              name: true,
              price: true, 
            },
          },
          category:{
            select:{
              name: true
            }
          },
          city:{
            select:{
              name: true
            }
          },
          country:{
            select:{
              name: true
            }
          }
        },
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  private buildFilterConditions(filter: GetHotelFilterDTO) {
    try {
      const { name, address, countryId, starRating, categoryId, occupancy, maxPrice, minPrice, checkIn } = filter;
      const where: any = {};
      where['isActive'] = true;
      if (name) where['name'] = { contains: name };
      if (address) where['address'] = address;
      if (countryId) where['countryId'] = countryId;
      if (starRating !== undefined) where['starRating'] = starRating;
      if (categoryId ) where['categoryId'] = categoryId;
      if (occupancy !== undefined && occupancy > 0 || minPrice !== undefined || maxPrice !== undefined) {
        where['rooms'] = {
          some: {
          }
        };
      
        if (occupancy) {
          where['rooms'].some.occupancy = { gte: parseInt(String(occupancy)) };
        }
      
        if (minPrice !== undefined || maxPrice !== undefined) {
          where['rooms'].some.price = {};
      
          if (minPrice) {
            where['rooms'].some.price.gte = parseInt(String(minPrice)) ;
          }
      
          if (maxPrice) {
            where['rooms'].some.price.lte = parseInt(String(maxPrice)) ;
          }
          
        } else {
          delete where['rooms'].some.price;
        }
        // console.log(checkIn)
        if (checkIn) {
          where['rooms'].some.orderDetails = {
            none: {
              oder: {
                    checkIn: {
                      not:new Date(checkIn)
                    },
                    checkOut: {
                      gte: new Date(checkIn),
                    },
                    status: OrderStatus.DONE,
              },
            },
          };
        }
      }

      
      
      return where;
      
    } catch (error) {
      throw new Error(error)
    }
  }

  async getUsersForHotel(hotelId: string, page: number, perPage: number) : Promise<any> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const usersWithInfo = await this.prismaService.order.findMany({
      where: {
        hotelId,
      },
      select: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            profile: {
              select: {
                avatarUrl: true,
                phoneNumber: true,
                fullName: true
              },
            },
          },
        },
        status: true, 
        id: true
      },
      skip,
      take,
      distinct: ['userId'], 
    });

    const user =  usersWithInfo.map((order) => ({
      id: order.id,
      userId: order.user.id,
      fullName: order.user.profile?.fullName || null,
      email: order.user.email,
      avatarUrl: order.user.profile?.avatarUrl || null, 
      phoneNumber: order.user.profile?.phoneNumber || null, 
      orderStatus: order.status, 
    }))
    const meta = { page, perPage, totalItems, totalPages };
    return {user,meta}
  }
  

  async getReservationsCountByHotel(hotelId: string): Promise<any> {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const usersThisMonth = await this.prismaService.order.count({
      where: {
        hotelId,
        checkIn: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
    });

    const usersLastMonth = await this.prismaService.order.count({
      where: {
        hotelId,
        checkIn: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
    });

    return {usersThisMonth, usersLastMonth};
  }



  async bandHotel(id:string):Promise<Hotel>{
    const checkId = await this.prismaService.hotel.findUnique({
      where:{
        id:id
      }
    })
    if(!checkId){
      throw new NotFoundException('Not found id')
    }
    return await this.prismaService.hotel.update({
      where:{
        id : id
      },
      data:{
        isActive: false
      },
      include:{
        images:true,
      }
    })
  }
}
