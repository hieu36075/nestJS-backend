import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { AmenityService } from "./amenity.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Amenity } from "@prisma/client";
import { Roles } from "src/common/decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Public } from "src/common/decorator/public.decorator";


@Controller("amenity")
@ApiTags("Amenity")
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class AmenityController{
    constructor(
        private amenityService: AmenityService
    ){

    }

    @Public()
    @Get()
    async getAmenity():Promise<Amenity[]>{
        return this.amenityService.getAllAmenity();
    }
}