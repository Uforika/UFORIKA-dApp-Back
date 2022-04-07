import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH } from 'config';
import { Web3Module } from '@libs/web3';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Repositories } from './repositories';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([...Repositories]),
    JwtModule.register({
      secret: AUTH.SECRET,
    }),
    Web3Module,
  ],
  controllers: [],
  providers: [JwtStrategy, AuthService, RefreshTokenService],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {}
