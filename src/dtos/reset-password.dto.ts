/* eslint-disable */
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  activationCode: number;
}
