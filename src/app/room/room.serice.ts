import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}
}
