import { Global, Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entitties/role.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  controllers: [RolesController],
  exports: [RoleService],
})
export class RolesModule {}
