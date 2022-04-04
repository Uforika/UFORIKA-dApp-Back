import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { BadRequestError, ErrorDetail } from '../errors';

export class ClassValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    if (metadata.metatype === RmqContext) {
      return value;
    }
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestError(this.expandError(errors));
    }

    return object;
  }

  expandError(errors: ValidationError[]): ErrorDetail[] {
    const details: ErrorDetail[] = [];
    errors.forEach(({ property, contexts, children, constraints }) => {
      if (children) {
        this.expandError(children).forEach((error) => {
          details.push(error);
        });
      }
      if (constraints) {
        Object.keys(constraints).forEach((key) => {
          details.push({
            ...(contexts && { context: contexts[key] }),
            field: property,
            message: constraints[key].replace(property, '').trim(),
          });
        });
      }
    });
    return details;
  }
}
