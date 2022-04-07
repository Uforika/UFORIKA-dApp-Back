import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, JwtPayload } from '@libs/auth';
import {
  GetMeResponseDTO,
  GetSignMessageResponseDTO,
  RefreshTokenBodyDTO,
  SignInBodyDTO,
  SignInResponseDTO,
} from '../dtos/auth.controller.dtos';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDTO })
  async signIn(@Body() { address, signature }: SignInBodyDTO): Promise<SignInResponseDTO> {
    const result = await this.authService.signIn(address, signature);
    return SignInResponseDTO.fromPain(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDTO })
  async refreshToken(@Body() { refreshToken }: RefreshTokenBodyDTO): Promise<SignInResponseDTO> {
    const result = await this.authService.refreshToken(refreshToken);
    return SignInResponseDTO.fromPain(result);
  }

  @Get('message')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetSignMessageResponseDTO })
  getSignMessage(): GetSignMessageResponseDTO {
    return GetSignMessageResponseDTO.fromPain(this.authService.getSignMessage());
  }

  @Get('me')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetMeResponseDTO })
  getMe(@Req() req: { user: JwtPayload }): GetMeResponseDTO {
    return GetMeResponseDTO.fromPain(req.user);
  }
}
