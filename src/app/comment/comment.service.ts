import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Comment } from "@prisma/client";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCommentDTO } from "./dto/create.comment.dto";
import { UpdateCommentDTO } from "./dto/update.comment.dto";

@Injectable()
export class CommentService{
    constructor(
        private prismaService: PrismaService
    ){}

    async getComment(page:number, perPage:number):Promise<PaginationResult<Comment>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data = await this.prismaService.comment.findMany(
          {
            skip,
            take,
          }
        );
    
        const meta = { page, perPage, totalItems, totalPages };
    
        return { data, meta };
    }

    async getCommentByHotelId(id: string, page: number, perPage:number):Promise<PaginationResult<Comment>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        try {
          const data = await this.prismaService.comment.findMany(
            {
              where:{
                  hotelId: id
              },
              skip,
              take,
            }
          ); 
          
          const meta = { page, perPage, totalItems, totalPages };
          return { data, meta };
        } catch (error) {
          throw new ForbiddenException('Please check again')
        }
    }

    async getAllCommentByHotelId(id: string):Promise<Comment[]>{
      try {
        const data = await this.prismaService.comment.findMany(
          {
            where:{
                hotelId: id
            },

          }
        );    
        return data
      } catch (error) {
        throw new ForbiddenException('Please check again')
      }
  }

    

    async createComment(@Body() id: string, createCommentDTO: CreateCommentDTO): Promise<Comment>{
      return this.prismaService.comment.create({
        data:{
          ...createCommentDTO,
          userId: id
        }
      })
    }

    async updateComment(@Body() updateCommentDTO: UpdateCommentDTO): Promise<Comment>{
      const comment = this.checkCommentById(updateCommentDTO.id);
      if(!comment){
        throw new NotFoundException("Don't find id")
      }
      const update =  this.prismaService.comment.update({
        where:{
          id: updateCommentDTO.id
        },
        data:{
          ...updateCommentDTO,
          updateAt: new Date(),
        }
      })
      return update;
    }

    async deleteComment(id: string){
      return this.prismaService.comment.delete({
        where:{
          id:id
        }
      })
    }

    async checkCommentById(id: string):Promise<Comment>{
      return this.prismaService.comment.findUnique({
        where:{
          id:id
        }
      })
    }
}

