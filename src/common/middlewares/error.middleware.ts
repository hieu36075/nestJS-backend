// src/common/middlewares/error.middleware.ts
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class ErrorMiddleware implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: error.message || 'Internal server error',
    });
  }
}
