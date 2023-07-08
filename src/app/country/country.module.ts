import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryControlller } from './country.controller';


@Module({
    imports: [],
    controllers: [CountryControlller],
    providers: [CountryService],
})
export class CountryModule { }
