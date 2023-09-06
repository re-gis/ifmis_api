/* eslint-disable */
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from 'src/dtos/login.dto';
import { User } from 'src/entitties/user.entity';
import { VerifyAccountDTO } from 'src/dtos/verify-account.dto';
import { ApiResponse } from 'src/payload/apiResponse';
import { ResetPasswordDTO } from 'src/dtos/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public isUserAvailable: User;
  constructor(private userService: UsersService) {}

  @Post('/login')
  async login(@Body() dto: LoginDTO): Promise<ApiResponse> {
    this.isUserAvailable = await this.userService.getUserByEmail(dto.email);
    const arePasswordsMatch = await bcrypt.compare(
      dto.password.toString(),
      this.isUserAvailable.password.toString(),
    );
    if (!arePasswordsMatch)
      throw new BadRequestException('Invalid email or password');
    return new ApiResponse(
      true,
      'User loggedInSucccessfully',
      await this.userService.login(dto),
    );
  }
  @Post('verify_account')
  async VerifyAccount(@Body() dto: VerifyAccountDTO): Promise<ApiResponse> {
    this.isUserAvailable = await this.userService.getUserByEmail(dto.email);
    if (this.isUserAvailable.activationCode != dto.verificationCode)
      throw new BadRequestException(
        'The provided verification code is invalid',
      );
    return new ApiResponse(
      true,
      'Your account is verified successfully',
      await this.userService.verifyAccount(dto.email),
    );
  }

  @Post('reset_password')
  async resetPassword(@Body() dto: ResetPasswordDTO): Promise<ApiResponse> {
    return new ApiResponse(
      true,
      'Your account was rest successfully ',
      await this.userService.resetPassword(
        dto.email,
        dto.activationCode,
        dto.newPassword,
      ),
    );
  }
}
