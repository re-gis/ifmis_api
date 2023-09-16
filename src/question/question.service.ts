/* eslint-disable */
import {
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entitties/question.entity';
import { User } from 'src/entitties/user.entity';
import { Status } from 'src/enums/Status.enum';
import { RoleService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { QuestionDto } from 'src/dtos/question.dto';
import { Exception } from 'handlebars';
import { QnReponse } from 'src/entitties/QnResponse';
import { QnReponseDto } from 'src/dtos/QnReponseDto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(User) public userRepo: Repository<User>,
    @InjectRepository(Question) public quesRepo: Repository<Question>,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UsersService) private readonly userService: UsersService,
    private roleService: RoleService,
  ) {}

  async getQuestionOwner(qnId: number): Promise<User> {
    const question = await this.quesRepo.findOne({
      where: { id: qnId },
      relations: ['user'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${qnId} not found!`);
    }

    if (!question.user) {
      throw new NotFoundException(
        `Owner for question with ID ${qnId} not found!`,
      );
    }

    return question.user;
  }

  async getUserQns(userId: number): Promise<Question[]> {
    // User exists
    const availableUser = await this.userService.getUserById(userId, 'User');
    if (!availableUser) {
      throw new NotFoundException(`User ${userId} not found!`);
    }
    // Get questions
    const questions = await this.quesRepo.find({
      where: { user: { id: userId } },
    });

    if (!questions.length) {
      throw new NotFoundException(`No questions found for user ${userId}`);
    }

    return questions;
  }

  async getAllQuestions(): Promise<Question[]> {
    const questions = await this.quesRepo.find({
      relations: ['user'],
    });

    if (!questions.length) {
      throw new NotFoundException('No questions found!');
    }
    return questions;
  }

  async getPendingQuestions() {
    const pendingQuestions = await this.quesRepo.find({
      where: {
        status: Status.PENDING,
      },
    });

    return pendingQuestions;
  }

  async getRejectedQuestions() {
    const rejectedQuestions = await this.quesRepo.find({
      where: {
        status: Status.REJECTED,
      },
    });

    return rejectedQuestions;
  }

  async getApprovedQuestions() {
    const approvedQuestions = await this.quesRepo.find({
      where: {
        status: Status.APPROVED,
      },
    });

    return approvedQuestions;
  }

  async createQuestion(
    body: QuestionDto,
  ): Promise<{ success: boolean; message: string; data: Question }> {
    const { content } = body;
    if (!content) throw new BadRequestException('Content must be available...');
    try {
      const qn: Question = this.quesRepo.create({
        content: content,
        status: Status.PENDING,
      });

      await this.quesRepo.save(qn);

      return {
        success: true,
        message: 'Your question was submitted...',
        data: qn,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error saving the question...');
    }
  }

  async getQnById(id: number, entity: String) {
    const response = await this.quesRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!response) throw new NotFoundException(`${entity} not found...`);
    return response;
  }

  async respondQn(
    qnId: number,
    body: QnReponseDto,
  ): Promise<{ success: boolean; message: String; data: Object }> {
    // Get the question from database
    const qn = await this.getQnById(qnId, 'Question');
    if (!qn) {
      throw new NotFoundException('Question not found!');
    }

    if (qn.status !== Status.PENDING) {
      throw new BadRequestException('Question is already approved or rejected');
    }

    qn.response = body.content;
    qn.status = Status.APPROVED;

    try {
      await this.quesRepo.save(qn);
      return {
        success: true,
        message: 'Question approved',
        data: qn,
      };
    } catch (e) {
      throw new InternalServerErrorException(
        'Error while approving the question...',
      );
    }
  }

  // Reject a qn
  async rejectQuestion(qnId: number): Promise<string> {
    // find the qn first
    const qn = await this.quesRepo.findOne({ where: { id: qnId } });
    if (!qn) {
      throw new NotFoundException(`Question ${qnId} not found!`);
    }

    if (qn.status === Status.REJECTED) {
      return `Question ${qnId} already rejected!`;
    }

    // Reject
    qn.status = Status.REJECTED;
    await this.quesRepo.save(qn);

    return `Question ${qnId} rejected...`;
  }
}
