import { Severity } from '@sentry/types';
import { sentryService } from '@libs/exceptions';

export function sentry(type?: Severity.Error) {
  return (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>,
  ): TypedPropertyDescriptor<(...args: unknown[]) => unknown> => {
    switch (type) {
      case Severity.Error:
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]): Promise<unknown> {
          let result = null;
          try {
            result = await originalMethod.apply(this, args);
            return result;
          } catch (error) {
            sentryService.error(error);
            throw error;
          }
        };
        return descriptor;
      default:
        return descriptor;
    }
  };
}
