import { ApiPropertyDate } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';
import { ConstructableDTO } from './constructable.dtos';

export class GetResendDateResponseDTO extends ConstructableDTO<GetResendDateResponseDTO> {
  @ApiPropertyDate()
  @Expose()
  date: string | null;
}
