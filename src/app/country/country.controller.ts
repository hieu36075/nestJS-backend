import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CountryService } from "./country.service";
import { Country } from "@prisma/client";
import { Roles } from "src/common/decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('country')
@ApiTags('Country')
@ApiBearerAuth('JWT-auth')
@Roles('user')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CountryControlller{
    constructor(
        private countryService : CountryService,
    ){}

    @Get()
    async getAll(): Promise<Country[]>{
        return await this.countryService.getCountry();
    }
}