/* eslint-disable */
import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { QuestionService } from './question.service';
import { QuestionDto } from 'src/dtos/question.dto';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}
  @Get('/all')
  @Roles('ADMIN')
  async getAllQuestions(): Promise<any> {
    return this.questionService.getAllQuestions();
  }

  @Get('/approved')
  @Roles('ADMIN')
  async getApprovedQuestions(): Promise<any> {
    return this.questionService.getApprovedQuestions();
  }

  @Get('/rejected')
  @Roles('ADMIN')
  async getRejectedQuestions(): Promise<any> {
    return this.questionService.getRejectedQuestions();
  }

  @Get('/pending')
  @Roles('ADMIN')
  async getPendingQuestions(): Promise<any> {
    return this.questionService.getPendingQuestions();
  }

  @Post('/create')
  async askQuestion(@Body() askQuestionDto: QuestionDto): Promise<any> {
    return this.questionService.createQuestion(askQuestionDto);
  }

  @Patch('/reject/:id')
  async rejectQuestion(@Param('id') qnId: number): Promise<any> {
    return this.questionService.rejectQuestion(qnId);
  }
}
