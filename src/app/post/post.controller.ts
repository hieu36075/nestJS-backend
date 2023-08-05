import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator';
import { GetUser } from 'src/common/decorator/user.decorator';
import { CreatePostDTO } from './dto/create.note.dto';
import { UpdatePostDTO } from './dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Post as PostEntity } from '@prisma/client';

@Controller('posts')
@ApiTags('Post')
@ApiBearerAuth('JWT-auth')
@Roles('User', 'Admin')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getPost(): Promise<PostEntity[]> {
    return await this.postService.getPost();
  }

  @Get('getByUserId')
  async getPostByUser(@GetUser('id') userId: string): Promise<PostEntity[]> {
    return await this.postService.getPostByUser(userId);
  }

  @Get(':id')
  getPostById(@Query('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  @Post()
  createPost(
    @GetUser('id') userId: string,
    @Body() createPostDto: CreatePostDTO,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch(':id')
  updatePostById(
    @Param('id') postId: string,
    @Body() updatePostDTO: UpdatePostDTO,
  ) {
    return this.postService.updatePostById(postId, updatePostDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deletePost(@Query('id') postId: string): Promise<void> {
    return this.postService.deletePostById(postId);
  }
}
