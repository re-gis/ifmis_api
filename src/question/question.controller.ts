/* eslint-disable */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}
  @Get('/all')
  @Roles('ADMIN')
  getAllQuestions() {
    return this.questionService.getAllQuestions();
  }

  @Get('/approved')
  @Roles('ADMIN')
  getApprovedQuestions() {
    return this.questionService.getApprovedQuestions();
  }

  @Get('/rejected')
  @Roles('ADMIN')
  getRejectedQuestions() {
    return this.questionService.getRejectedQuestions();
  }

  @Get('/pending')
  @Roles('ADMIN')
  getPendingQuestions() {
    return this.questionService.getPendingQuestions();
  }

  // @Get('/')
}
