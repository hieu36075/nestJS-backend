import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      return request.headers['authorization']?.replace('Bearer ', '');
    },
  );