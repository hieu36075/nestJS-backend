import { Controller } from "@nestjs/common";
import { CityService } from "./city.service";

@Controller()
export class CityController{
    constructor(
        private cityService: CityService
    ){}
}