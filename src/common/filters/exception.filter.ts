import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { customErrorCodes } from '../constants/error-codes';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
        ? (exceptionResponse as { message: string }).message
        : 'Internal server error';

    const exceptionName = exception instanceof HttpException ? exception.name : 'InternalServerError';
    const customCode = customErrorCodes[exceptionName] || 'INTERNAL_SERVER_ERROR';

    response.status(status).json({
      status: 'error',
      statusCode: status,
      code: customCode,
      message,
      error: {
        details: exception instanceof Error ? exception.message : 'Something went wrong',
      },
      eventTime: new Date().toISOString(),
      path: request.url,
    });
  }
}
