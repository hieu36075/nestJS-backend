import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetUser } from 'src/common/decorator/user.decorator';
import { Profile } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { CreateProfileDTO } from './dto/create.profile.dto';
import { UpdateProfileDTO } from './dto/update.profile.dto';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getMyProfile(@GetUser('id') userId: string): Promise<Profile> {
    return await this.profileService.getMyProfile(userId);
  }

  @Post()
  async createProfile(
    @GetUser('id') userId: string,
    @Body() createProfileDTO: CreateProfileDTO,
  ): Promise<Profile> {
    return await this.profileService.createProfile(userId, createProfileDTO);
  }

  @Patch()
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<Profile> {
    return await this.profileService.updateProfile(userId, updateProfileDTO);
  }
}
