import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResultDTO {
  @ApiProperty()
  @Expose()
  result: boolean;

  @ApiProperty()
  @Expose()
  details: string;

  constructor(result: boolean, details: string = '') {
    this.result = result;
    this.details = details;
  }
}
