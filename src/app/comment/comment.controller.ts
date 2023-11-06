import { CacheInterceptor } from "@nestjs/cache-manager";
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CommentService } from "./comment.service";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { Comment } from "@prisma/client";
import { CreateCommentDTO } from "./dto/create.comment.dto";
import { GetUser } from "src/common/decorator/user.decorator";
import { UpdateCommentDTO } from "./dto/update.comment.dto";

@Controller('comment')
@ApiTags('Comment')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CommentController{
    constructor(
        private commentService: CommentService
    ){}

    @Get()
    async getAll(
        @Query('page') page: number,
        @Query('perPage') perPage: number
    ): Promise<PaginationResult<Comment>>{
        return await this.commentService.getComment(page, perPage)
    }

    @Get('getByHotelId')
    async getByHotelId(
        @Query('id') id: string,
        @Query('page') page: number,
        @Query('perPage') perPage: number
    ): Promise<PaginationResult<Comment>>{
        return await this.commentService.getCommentByHotelId(id, page, perPage)
    }

    @Get(':id/hotel')
    async getAllByHotelId(@Param('id') id: string) : Promise<Comment[]>{
        return await this.commentService.getAllCommentByHotelId(id)
    }
    @Post()
    async createComment(@GetUser('id') id: string, @Body() createCommentDTO: CreateCommentDTO):Promise<Comment>{
        return this.commentService.createComment(id, createCommentDTO)
    }

    @Patch()
    async updateComment(@Body() updateCommentDTO: UpdateCommentDTO):Promise<Comment>{
        return this.commentService.updateComment(updateCommentDTO)
    }
}