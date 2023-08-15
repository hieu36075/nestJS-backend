import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { Country } from '@prisma/client';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateCountryDTO } from './dto/create.country.dto';
import { PaginationResult } from 'src/common/interface/pagination.interface';

@Controller('country')
@ApiTags('Country')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CountryControlller {
  constructor(private countryService: CountryService) {}

  @Public()
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaginationResult<Country>> {
    return await this.countryService.getCountry(page, perPage);
  }

  @Public()
  @Get('topCountry')
  async topCountriesWithMostHotels(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise <PaginationResult<Country>> {
    // this.socketGateway.sendNotificationToClient(userId, { action: 'countryAction' });
    return await this.countryService.topCountriesWithMostHotels(page, perPage);
  }

  @Post()
  async createCountry(@Body() createCountryDTO: CreateCountryDTO): Promise<Country>{
    return await this.countryService.createCountry(createCountryDTO);
  }
}
