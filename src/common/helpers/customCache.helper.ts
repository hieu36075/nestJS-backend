import { CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
var jwt = require('jsonwebtoken');

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      return null;
    }
    try {
        const decoded = jwt.verify(token, 'test123') as any; 
      const userId = decoded.id;
      const cacheKey = `cache-${userId}${request.url}`;
      return cacheKey;
    } catch (error) {
        console.log(error)
      return null;
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    return authHeader.split(' ')[1]; 
  }
}
