import { Module } from '@nestjs/common';
import { AuthModule as AuthModuleLib } from '@libs/auth';
import { Services } from './services';
import { Controllers } from './controllers';

@Module({
  imports: [AuthModuleLib],
  controllers: [...Controllers],
  providers: [...Services],
})
export class AuthModule {}
