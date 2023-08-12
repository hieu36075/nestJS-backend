import { Controller } from "@nestjs/common";
import { ImageCommentService } from "./imageComment.service";

@Controller('imageComment')
export class ImageCommentController{
    constructor(
        private imageCommentService: ImageCommentService
    ){}
}