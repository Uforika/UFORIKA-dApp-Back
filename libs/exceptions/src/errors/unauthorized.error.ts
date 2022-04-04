import { UnauthorizedException } from '@nestjs/common';
import { ErrorDetail, IAbstractError } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Unauthorized',
  },
];

export class UnauthorizedError extends UnauthorizedException implements IAbstractError {
  private readonly pDetails: ErrorDetail[] = [];

  constructor(details: ErrorDetail[] = defaultError) {
    super();

    this.pDetails = details;
  }

  get details(): ErrorDetail[] {
    return this.pDetails;
  }
}
