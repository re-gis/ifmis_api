import { Global, Module, forwardRef } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule), JwtModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
