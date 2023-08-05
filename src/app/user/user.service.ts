import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { SocketGateway } from 'src/providers/socket/socket.gateway';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly redisService: RedisService,
    private socketGateway: SocketGateway,
  ) {}

  async getUser(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        profile: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    // const sanitizedUsers = users.map(user => Object.assign({}, user, { hashedPassword: undefined }));
    users.forEach((user) => {
      delete user.hashedPassword;
    });
    return users;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('Cannot find user with the provided ID');
    }
    delete user.hashedPassword;
    this.socketGateway.sendNotification(user.id, 'getUser', 'test 1');
    return user;
  }
}
