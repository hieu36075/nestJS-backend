import { Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(404).json({
      statusCode: 404,
      message: 'Not Found',
    });
  }
}
