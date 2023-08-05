import { Injectable } from '@nestjs/common';
import { CategoryRoom } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class CategoryRoomSerive {
  constructor(private prismaService: PrismaService) {}
  async getAll(): Promise<CategoryRoom[]> {
    return await this.prismaService.categoryRoom.findMany();
  }
}
