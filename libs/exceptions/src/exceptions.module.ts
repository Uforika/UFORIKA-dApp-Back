import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core/constants';

import { HttpExceptionFilter } from './filters/exception.filter';
import { ClassValidationPipe } from './middlewares/validation.pipe';
import { sentryService } from './providers/services/sentry.service';

@Module({})
export class ExceptionsModule {
  static forRoot({
    serverName,
    includeValidationPipe = true,
  }: {
    serverName: string;
    includeValidationPipe?: boolean;
  }): DynamicModule {
    sentryService.init(serverName);

    const providers: any[] = [
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      },
      {
        provide: 'ISentryService',
        useValue: sentryService,
      },
    ];

    if (includeValidationPipe) {
      providers.push({
        provide: APP_PIPE,
        useClass: ClassValidationPipe,
      });
    }

    return {
      module: ExceptionsModule,
      providers,
    };
  }
}
