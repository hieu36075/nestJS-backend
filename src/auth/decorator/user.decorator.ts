import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((key: string, context: ExecutionContext) =>{
    // const request:Express.Request = context.switchToHttp().getRequest();
    // const user = request.user.user
    const { user } = context.switchToHttp().getRequest();
    return key ? user?.user?.[key]: user
})