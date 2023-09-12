/* eslint-disable */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
