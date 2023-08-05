import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryControlller } from './country.controller';
import { SocketGateway } from 'src/providers/socket/socket.gateway';

@Module({
  imports: [],
  controllers: [CountryControlller],
  providers: [CountryService],
})
export class CountryModule {}
