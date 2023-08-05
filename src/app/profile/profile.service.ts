import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateProfileDTO } from './dto/create.profile.dto';
import { UpdateProfileDTO } from './dto/update.profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async getMyProfile(userId: string): Promise<Profile> {
    return await this.prismaService.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async createProfile(
    userId: string,
    @Body() createProfileDTO: CreateProfileDTO,
  ): Promise<Profile> {
    return await this.prismaService.profile.create({
      data: {
        userId: userId,
        ...createProfileDTO,
      },
    });
  }

  async updateProfile(
    userId: string,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<Profile | null> {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Cannot find ID');
    }

    const newPost = await this.prismaService.profile.update({
      where: {
        userId: userId,
      },
      data: {
        ...updateProfileDTO,
      },
    });
    return newPost;
  }
}
