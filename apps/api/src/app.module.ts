import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionsModule } from '@libs/exceptions';
import ormconfig from '../../../ormconfig';
import { GeneralModule } from './general/general.module';

@Module({
  imports: [
    ExceptionsModule.forRoot({ serverName: 'API' }), //
    TypeOrmModule.forRoot(ormconfig),
    GeneralModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
