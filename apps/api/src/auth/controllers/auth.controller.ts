import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Auth, JwtPayload } from '@libs/auth';
import { SuccessDTO } from '@libs/dtos';
import { AUTH_TOKEN_TYPES } from '@libs/auth/constants/token.constants';
import {
  GetMeResponseDTO,
  GetSignMessageResponseDTO,
  RefreshTokenBodyDTO,
  SignInBodyDTO,
  SignInResponseDTO,
} from '../dtos/auth.controller.dtos';
import { AuthService } from '../services/auth.service';
import { clearAuthCookie, setAuthCookieToResponse } from '../helpers/auth-cookie.helpers';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDTO })
  async signIn(@Res() response: Response, @Body() { address, signature }: SignInBodyDTO): Promise<void> {
    const result = await this.authService.signIn(address, signature);
    setAuthCookieToResponse(response, result);
    response.send(SignInResponseDTO.fromPain(result));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDTO })
  async refreshToken(
    @Req() request: Request,
    @Res() response: Response,
    @Body() { refreshToken }: RefreshTokenBodyDTO,
  ): Promise<void> {
    const rToken = refreshToken || request.cookies?.[AUTH_TOKEN_TYPES.REFRESH_TOKEN];
    const result = await this.authService.refreshToken(rToken);
    setAuthCookieToResponse(response, result);
    response.send(SignInResponseDTO.fromPain(result));
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessDTO })
  async signOut(@Res() response: Response, @Body() { refreshToken }: RefreshTokenBodyDTO): Promise<void> {
    await this.authService.signOut(refreshToken);
    clearAuthCookie(response);
    response.send(new SuccessDTO());
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
