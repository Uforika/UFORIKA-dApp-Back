import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionsModule } from '@libs/exceptions';
import ormconfig from '../../../ormconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ExceptionsModule.forRoot({ serverName: 'API' }), //
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
