/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from 'src/entitties/user.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { UtilsService } from 'src/utils/utils.service';
import { EAccountStatus } from 'src/enums/EAccountStatus.enum';
import { ERole } from 'src/enums/ERole.enum';
import { LoginDTO } from 'src/dtos/login.dto';
import { EGender } from 'src/enums/EGender.enum';
import { RoleService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public userRepo: Repository<User>,
    private roleService: RoleService,
    private mailingService: MailingService,
    private utilsService: UtilsService,
  ) {}

  async getUsers() {
    const user = await this.userRepo.findOne({
      where: {
        id: 1,
      },
    });
    // user.roles.push(await this.roleService.getRoleById(1));
    // await this.userRepo.save({
    //   ...user,
    //   roles: [await this.roleService.getRoleById(1)],
    // });
    const response = await this.userRepo.find({ relations: ['roles'] });
    return response;
  }

  async getUserByEmail(email: any) {
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
      relations: ['roles'],
    });
    if (!user)
      throw new NotFoundException(
        'The user with the provided email is not found',
      );
    return user;
  }

  async getUserById(id: number, entity: String) {
    const response = await this.userRepo.findOne({
      where: {
        id: id,
      },
      relations: ['roles'],
    });
    if (!response) {
      throw new NotFoundException(`${entity} not found`);
    } else {
      return response;
    }
  }

  generateRandomFourDigitNumber(): number {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async login(dto: LoginDTO) {
    const user = await this.getUserByEmail(dto.email);
    if (
      user.status ==
        EAccountStatus[EAccountStatus.WAITING_EMAIL_VERIFICATION] ||
      user.status == EAccountStatus[EAccountStatus.PENDING]
    )
      throw new BadRequestException(
        'This account is not yet verified, please check your gmail inbox for verification details',
      );
    const tokens = this.utilsService.getTokens(user);
    return tokens;
  }
  async verifyAccount(email: string) {
    const verifiedAccount = await this.getUserByEmail(email);
    if (verifiedAccount.status === EAccountStatus[EAccountStatus.ACTIVE])
      throw new BadRequestException('This is already verified');
    verifiedAccount.status = EAccountStatus[EAccountStatus.PENDING];
    verifiedAccount.roles.forEach((role) => {
      if (role.role_name == ERole[ERole.ADMIN]) {
        verifiedAccount.status = EAccountStatus[EAccountStatus.ACTIVE];
      }
    });
    const verifiedAccount2 = await this.userRepo.save(verifiedAccount);
    const tokens = await this.utilsService.getTokens(verifiedAccount2);
    delete verifiedAccount2.password;
    return { tokens, user: verifiedAccount2 };
  }
  async resetPassword(
    email: string,
    activationCode: number,
    newPassword: string,
  ) {
    const account = await this.getUserByEmail(email);
    if (!account) throw new BadRequestException('This account does not exist');
    // if (
    //   account.status === EAccountStatus[EAccountStatus.PENDING] ||
    //   account.status == EAccountStatus[EAccountStatus.WAIT_EMAIL_VERIFICATION]
    // )
    //   throw new BadRequestException(
    //     "Please first verify your account and we'll help you to remember your password later",
    //   );
    // if (account.activationCode != activationCode)
    //   throw new BadRequestException(
    //     'Your provided invalid activation code, you can request another.',
    //   );
    account.password = await this.utilsService.hashString(
      newPassword.toString(),
    );
    const savedUser = await this.userRepo.save(account);
    const tokens = await this.utilsService.getTokens(account);
    delete savedUser.password;
    delete savedUser.activationCode;
    return { tokens, user: savedUser };
  }
  async createUser(body: CreateUserDto) {
    let {
      firstName,
      lastName,
      email,
      username,
      myGender,
      registercode,
      national_id,
      phonenumber,
      password,
    } = body;
    if (registercode != 'rcaKeyAdmin') {
      return new UnauthorizedException('Incorrect Registration Key');
    }

    let email2: any = email;
    const userFetched = await this.userRepo.findOne({
      where: {
        email: email2,
      },
    });
    if (userFetched) return new UnauthorizedException('Email already exists');

    const status: String =
      EAccountStatus[EAccountStatus.WAITING_EMAIL_VERIFICATION].toString();
    let gender;
    const role = await this.roleService.getRoleById(1);
    switch (myGender.toLowerCase()) {
      case 'male':
        gender = EGender[EGender.MALE];
        break;
      case 'female':
        gender = EGender[EGender.FEMALE];
        break;
      default:
        throw new BadRequestException('The provided gender is invalid');
    }
    const userToCreate = new User(
      firstName,
      lastName,
      email,
      username,
      gender,
      national_id,
      phonenumber,
      password,
      EAccountStatus.WAITING_EMAIL_VERIFICATION,
    );
    const activationCode = this.generateRandomFourDigitNumber();
    userToCreate.activationCode = activationCode;
    userToCreate.password = await this.utilsService.hashString(password);
    try {
      const userEntity = this.userRepo.create(userToCreate);
      const createdEnity = this.userRepo.save({ ...userEntity, roles: [role] });
      await this.mailingService.sendVerificationEmail(
        userEntity.email.toString(),
      );
      return {
        success: true,
        message:
          'we have sent an verification code to your inbox , please head their and verify your account',
      };
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.getUserById(id, 'User');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }
  async deleteUser(id: number) {
    const user = await this.getUserById(id, 'User');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepo.remove(user);
    return user;
  }
}
