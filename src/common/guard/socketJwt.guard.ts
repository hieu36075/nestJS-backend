import { CanActivate, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { PrismaService } from "src/database/prisma/prisma.service";
var jwt = require('jsonwebtoken');
@Injectable()
export class WsGuard implements CanActivate {

    constructor( 
      private prismaService: PrismaService,
      private readonly configService: ConfigService
      ) {
    }

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, this.configService.get('JWT_SECRET')) as any;
            return new Promise(async (resolve, reject) => {
              const user = await this.prismaService.user.findUnique({
                where: {
                  id: decoded.id
                }
              });
              if (user) {
                context.switchToHttp().getRequest().user = user; 
                resolve(user);
              } else {
                reject(false);
              }
            });
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}