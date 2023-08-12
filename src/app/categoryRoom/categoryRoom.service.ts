import { Injectable, Query } from '@nestjs/common';
import { CategoryRoom } from '@prisma/client';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CategoryRoomSerive {
  constructor(private prismaService: PrismaService) {}
  async getAll(page:number, perPage: number): Promise<PaginationResult<CategoryRoom>> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.categoryRoom.findMany(
      {
        skip,
        take,
      }
    );

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }
}
