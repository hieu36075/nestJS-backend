import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Country, Hotel } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateHotelDTO } from './dto/create.hotel.dto';
import { UpdateHotelDTO } from './dto/update.hotel.dto';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { GetHotelFilterDTO } from './dto/getfilter.hotel.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { S3Service } from 'src/providers/aws s3/aws.s3.service';
import * as moment from 'moment';

@Injectable()
export class HotelService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service
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

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    try{
      const hotel = await this.prismaService.hotel.findUnique({
          where: {
          id: hotelId, // Truyền giá trị của hotelId vào đây
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

  async createHotel(@Body() createHotelDTO: CreateHotelDTO): Promise<Hotel> {
    const { peeks, ...hotelData } = createHotelDTO;
    // Tìm các peek dựa trên danh sách id peek
    const peeksDataPromises = peeks.map(async (peek) => {
      return this.prismaService.amenity.findUnique({
        where: {
          id: peek.id,
        },
      });
    });
    const peeksData = await Promise.all(peeksDataPromises);
    
    return await this.prismaService.hotel.create({
      data: {
        ...hotelData,
        amenities: {
          connect: peeksData, // Kết nối với danh sách peeksData
        },
      },
    });
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
    console.log(id)
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
      const { name, address, countryId, starRating, categoryId, occupancy, maxPrice, minPrice } = filter;
      const where: any = {};
  
      if (name) where['name'] = { contains: name };
      if (address) where['address'] = address;
      if (countryId) where['countryId'] = countryId;
      if (starRating !== undefined) where['starRating'] = starRating;
      if (categoryId ) where['categoryId'] = categoryId;
      if (occupancy !== undefined || minPrice !== undefined || maxPrice !== undefined) {
        where['rooms'] = {
          some: {}
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
          // Nếu một trong hai trống, xóa điều kiện tìm kiếm theo giá
          delete where['rooms'].some.price;
        }
      }
      
      return where;
      
    } catch (error) {
      throw new Error(error)
    }
  }
}
