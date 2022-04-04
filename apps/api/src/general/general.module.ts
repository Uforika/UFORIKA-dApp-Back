import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories';
import { GeneralService } from './services';
import { GeneralController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [GeneralController],
  providers: [GeneralService],
})
export class GeneralModule {}
