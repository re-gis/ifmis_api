import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitties/user.entity';
import { Question } from 'src/entitties/question.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Question]),
    ConfigModule,
    JwtModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
