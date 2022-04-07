import { ApiPropertyNumber, ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose, plainToClass } from 'class-transformer';
import { AuthResponseType } from '@libs/auth';

export class SignInBodyDTO {
  @ApiPropertyString()
  address: string;

  @ApiPropertyString()
  signature: string;
}

export class RefreshTokenBodyDTO {
  @ApiPropertyString()
  refreshToken: string;
}

export class SignInResponseDTO implements AuthResponseType {
  @ApiPropertyString()
  @Expose()
  accessToken: string;

  @ApiPropertyString()
  @Expose()
  refreshToken: string;

  @ApiPropertyNumber()
  @Expose()
  userId: number;

  static fromPain(data: SignInResponseDTO): SignInResponseDTO {
    return plainToClass(SignInResponseDTO, data, { excludeExtraneousValues: true });
  }
}

export class GetSignMessageResponseDTO {
  @ApiPropertyString()
  @Expose()
  message: string;

  static fromPain(message: string): GetSignMessageResponseDTO {
    return plainToClass(GetSignMessageResponseDTO, { message }, { excludeExtraneousValues: true });
  }
}

export class GetMeResponseDTO {
  @ApiPropertyNumber()
  @Expose()
  id: number;

  static fromPain(data: GetMeResponseDTO): GetMeResponseDTO {
    return plainToClass(GetMeResponseDTO, data, { excludeExtraneousValues: true });
  }
}
