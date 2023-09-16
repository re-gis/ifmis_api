/* eslint-disable */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class QnReponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
