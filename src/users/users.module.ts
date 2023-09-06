import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailingModule } from 'src/mailing/mailing.module';
import { UtilsModule } from 'src/utils/utils.module';
import { RolesModule } from 'src/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitties/user.entity';
// import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MailingModule,
    UtilsModule,
    RolesModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
