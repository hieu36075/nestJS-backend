
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { MyJwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/role.enum';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { CreatePostDTO } from './dto/create.note.dto';
import { UpdatePostDTO } from './dto';
import { CacheInterceptor  } from '@nestjs/cache-manager';


@Controller('posts')
@ApiTags('Post')
@ApiBearerAuth('JWT-auth')
@Roles('User','Admin')
@UseGuards(MyJwtGuard, RolesGuard) 
@UseInterceptors(CacheInterceptor)
export class PostController {
    constructor(
        private postService: PostService
        ){
    }

    @Get()
    getPost(){
        return this.postService.getPost()
    }

    @Get('getByUserId')
    getPostByUser(@GetUser('id') userId: string){
        return this.postService.getPostByUser(userId);
    }

    @Get(':id')
    getPostById(@Param('id') postId: string){
        return this.postService.getPostById(postId);
    }


    @Post()
    createPost(@GetUser('id') userId: string, @Body() createPostDto:CreatePostDTO){
        return this.postService.createPost(userId, createPostDto);
    }

    @Patch(":id")
    updatePostById(@Param('id') postId: string, @Body() updatePostDTO: UpdatePostDTO){
        return this.postService.updatePostById(postId, updatePostDTO);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    deletePost(@Query('id') postId: string){
        return this.postService.deletePostById(postId);
    }
}
