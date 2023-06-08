import { Body, ForbiddenException, Injectable, Query } from "@nestjs/common";
import { Post } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDTO } from "./dto/create.note.dto";
import { UpdatePostDTO } from "./dto";


@Injectable()
export class PostService{
    constructor(
        private prismaService: PrismaService,
        ){
    }



    getPost(){
        const posts = this.prismaService.post.findMany({
            select:{
                id:true,
                title:true,
                content:true,
                published: true,
            }
        })        
        return posts
    }

    // async getPostById(@Query('id') id?: string): Promise<Post>{
    //     return 
    // }

    async getPostById(postId: string){
        const postById = await this.prismaService.post.findUnique({
            where:{
                id: postId
            }
        })
        return postById
    }

    getPostByUser(userId: string){
        const postByUser = this.prismaService.post.findMany({
            where:{
                authorId: userId
            }
        })
        return postByUser
    }

    async createPost(id: string, @Body() createPostDTO:CreatePostDTO){
        const post = await this.prismaService.post.create({
            data:{
                ...createPostDTO,
                authorId: id
            }
        })
        return post
    }

    async updatePostById(postId:string, @Body() updatePostDTO:UpdatePostDTO){
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

    async deletePostById(postId:string){
        const post = await this.prismaService.post.findUnique({
            where:{
                id:postId
            }
        })

        if (!post){
            throw new ForbiddenException('Cannot find Post in Database')
        }
        
        return await this.prismaService.post.delete({
            where:{
                id:postId
            }
        })
    }
}