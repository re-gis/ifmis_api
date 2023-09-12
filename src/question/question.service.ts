/* eslint-disable */
import {
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entitties/question.entity';
import { User } from 'src/entitties/user.entity';
import { Status } from 'src/enums/Status.enum';
import { RoleService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { QuestionDto } from 'src/dtos/question.dto';
import { Exception } from 'handlebars';
import { QnReponse } from 'src/entitties/QnResponse';

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

  async getQuestionOwner(qnId: number) {
    const available = await this.quesRepo.findOne({
      where: {
        id: qnId,
      },
    });

    if (!available) {
      throw new NotFoundException('Question not found!');
    } else {
      return available.user;
    }
  }

  async getUserQns(userId: number) {
    const availableUser = await this.userService.getUserById(userId, 'User');
    const response = await this.quesRepo.find({
      where: {
        // user_id: availableUser.id,
      },
    });
  }

  async getAllQuestions() {
    const questions = await this.quesRepo.find();
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

  // async getYourQuestions(req: Request, res: Response) {
  //   const authorization = req.headers.authorization;
  //   if (authorization) {
  //     const token = authorization.split(' ')[1];
  //     if (!authorization.toString().startsWith('Bearer'))
  //       throw new UnauthorizedException('Invalid token');
  //     const { tokenVerified, error } = this.jwtService.verify(token, {
  //       secret: this.configService.get('SECRET_KEY'),
  //     });
  //     if (error) throw new UnauthorizedException(error.message);
  //     const decoded: any = await this.jwtService.decode(token);
  //     const owner = await this.getQuestionOwner(decoded.id);
  //     const myQuestions = await this.quesRepo.findOne({
  //       where: {
  //         user: owner
  //       },
  //     });
  //   }
  // }

  async createQuestion(body: Question) {
    const { content } = body;
    if (!content) throw new BadRequestException('Content must be available...');
    const qn = new Question();
    qn.content = content;
    qn.status = Status.PENDING;
    try {
      const qnEntity = this.quesRepo.create(qn);
      const createdEntity = this.quesRepo.save({ ...qnEntity });
      return {
        success: true,
        message: 'Your question is submitted...',
      };
    } catch (error) {
      throw new Exception(error.message);
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

  async respondQn(qnId: number, body: QnReponse) {
    // Get the question from database
    const qn = await this.getQnById(qnId, 'Question');
    if (!qn) throw new NotFoundException('Question not found!');
    if (qn.status != Status.PENDING) {
      throw new Exception('Question approved or rejected');
    } else {
      // save response
      
    }
  }
}
