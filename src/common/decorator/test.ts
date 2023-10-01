import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserFromWs = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context.switchToWs().getData().user;
    return user;
  },
);
