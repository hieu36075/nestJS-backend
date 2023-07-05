import { Body, ForbiddenException, Injectable, Query } from "@nestjs/common";
import { Post } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreatePostDTO } from "./dto/create.note.dto";
import { UpdatePostDTO } from "./dto";


@Injectable()
export class PostService{
    constructor(
        private prismaService: PrismaService,
        ){
    }



    async getPost() : Promise<Post[]> {
        return await this.prismaService.post.findMany()          
        
    }

    async getPostById(postId: string): Promise<Post>{
        return  await this.prismaService.post.findUnique({
            where:{
                id: postId
            }
        })
        
    }

    async getPostByUser(userId: string) : Promise<Post[]>{
        const postByUser = await this.prismaService.post.findMany({
            where:{
                authorId: userId
            }
        })
        console.log(postByUser)
        return postByUser
    }

    async createPost(id: string, @Body() createPostDTO:CreatePostDTO) : Promise<Post>{
        const post = await this.prismaService.post.create({
            data:{
                ...createPostDTO,
                authorId: id
            }
        })
        return post
    }

    async updatePostById(postId:string, @Body() updatePostDTO:UpdatePostDTO) : Promise<Post | null>{
        const post = await this.prismaService.post.findUnique({
            where:{
                id: postId
            }
        })

        if(!post){
            throw new ForbiddenException('Cannot find Post in Database')
        }

        const newPost = await this.prismaService.post.update({
            where:{
                id: postId
            },
            data:{
                ...updatePostDTO
            }
        })

        return newPost
    }

    async deletePostById(postId:string): Promise<void>{
        const post = await this.prismaService.post.findUnique({
            where:{
                id:postId
            }
        })

        if (!post){
            throw new ForbiddenException('Cannot find Post in Database')
        }
        
        await this.prismaService.post.delete({
            where:{
                id:postId
            }
        })
    }
}