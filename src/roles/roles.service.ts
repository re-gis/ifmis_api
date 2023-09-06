/* eslint-disable */
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ERole } from 'src/enums/ERole.enum';
import { Role } from 'src/entitties/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) public roleRepo: Repository<Role>) {}
  createRoles() {
    const roleArray: Array<ERole> = [
      ERole.ADMIN,
      ERole.ADMIN,
      ERole.SYSTEM_ADMIN,
      ERole.RESCUE_TEAM_ADMIN,
      ERole.POLICE_STATION_ADMIN,
      ERole.POLICE_STATION_ADMIN,
    ];
    roleArray.forEach((role) => {
      const roleEntity = this.roleRepo.create({
        role_name: ERole[role],
      });
      this.roleRepo.save(roleEntity);
    });
  }

  async getAllRoles() {
    return await this.roleRepo.find();
  }

  async getRoleById(id: number) {
    console.log(id);
    const role = await this.roleRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
