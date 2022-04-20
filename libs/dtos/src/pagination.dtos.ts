import { ApiPropertyNumber } from '@ppx-node/api-decorators';

export class PaginationQueryDTO {
  @ApiPropertyNumber({ isOptional: true })
  offset: number;
  @ApiPropertyNumber({ isOptional: true })
  limit: number;
}
