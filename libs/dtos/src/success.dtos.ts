import { Expose } from 'class-transformer';
import { ApiPropertyBoolean } from '@ppx-node/api-decorators';

export class SuccessDTO {
  @ApiPropertyBoolean()
  @Expose()
  success = true;
}
