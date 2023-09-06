import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  providers: [RoleService],
  controllers: [RolesController],
})
export class RolesModule {}
