import { Injectable } from "@nestjs/common";
import { Amenity } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class AmenityService{
    constructor(
        private prismaService: PrismaService
    ) {
        
    }
    async getAllAmenity():Promise<Amenity[]>{
        return await this.prismaService.amenity.findMany()
    }

}