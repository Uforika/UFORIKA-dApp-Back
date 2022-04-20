import { plainToClass } from 'class-transformer';

export class ConstructableDTO<T> {
  constructor(body: T) {
    Object.assign(
      this,
      plainToClass(
        this.constructor as {
          new (...args: any[]): T;
        },
        body,
        { excludeExtraneousValues: true },
      ),
    );
  }
}
