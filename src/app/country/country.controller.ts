import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { Country } from '@prisma/client';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('country')
@ApiTags('Country')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CountryControlller {
  constructor(private countryService: CountryService) {}

  @Get()
  async getAll(): Promise<Country[]> {
    return await this.countryService.getCountry();
  }

  @Public()
  @Get('topCountry')
  async topCountriesWithMostHotels(): Promise<Country[]> {
    // this.socketGateway.sendNotificationToClient(userId, { action: 'countryAction' });
    return await this.countryService.topCountriesWithMostHotels();
  }
}
