import {
  Controller,
  UseInterceptors,
  Get,
  UseGuards,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Category, Hotel } from '@prisma/client';
import { MyJwtGuard } from 'src/common/guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create.category.dto';
import { UpdateCategoryDTO } from './dto/update.category.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('categories')
@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@Roles('Admin')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @CacheKey('items')
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getAll();
  }

  @Get('hotels/:id')
  async getByCountry(@Param('id') countryId: string): Promise<Hotel[]> {
    return await this.categoriesService.getHotelByCategory(countryId);
  }
  @Post()
  createCategories(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDTO);
  }

  @Patch()
  updateCategories(
    @Param(':id') categoryId: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category | null> {
    return this.categoriesService.updateCategory(categoryId, updateCategoryDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deletePost(@Query('id') categoryId: string): Promise<void> {
    return this.categoriesService.deleteCategory(categoryId);
  }
}
