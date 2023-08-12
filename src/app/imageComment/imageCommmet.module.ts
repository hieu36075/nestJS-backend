import { Module } from "@nestjs/common";
import { ImageCommentController } from "./imageComment.controller";
import { ImageCommentService } from "./imageComment.service";

@Module({
    imports:[],
    controllers:[ImageCommentController],
    providers:[ImageCommentService]
})
export class ImageCommentModule{}