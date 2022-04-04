import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Severity } from '@sentry/node';
import { Response } from 'express';
import { ErrorDetail, IAbstractError, InternalErrorException, sentryService } from '@libs/exceptions';
import { sentry } from '../decorators/sentry.decorator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  @sentry(Severity.Error)
  catch(exception: unknown, host: ArgumentsHost): void {
    const type = host.getType();
    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response: Response = ctx.getResponse();
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        if (status >= 400 && status < 500) {
          const errors: ErrorDetail[] = this.instanceOfAbstractError(exception)
            ? exception.details
            : [{ field: '', message: exception.message }];
          response.status(status).json({ status, errors });
          return;
        }
        if (status === 503) {
          response.status(status).json(exception.getResponse());
          return;
        }
      }
      response.status(500).json({ status: 500, errors: 'Internal Server Error' });
    }
    let error;
    if (exception instanceof InternalErrorException) {
      error = exception.details[0];
    } else {
      error = exception instanceof Error ? exception : new Error(JSON.stringify(exception));
    }

    this.logger.error(error.message);
    sentryService.error(error);
  }

  private instanceOfAbstractError(object: any): object is IAbstractError {
    return typeof object === 'object' && object !== null && 'details' in object;
  }
}
