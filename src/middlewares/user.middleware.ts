import {
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserMiddleWare implements NestMiddleware {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let context: ExecutionContext;
    const request = req;
    const authorization = req.headers.authorization;
    if (
      req.baseUrl == '' ||
      req.baseUrl == '/favicon.ico' ||
      req.baseUrl == '/auth/login' ||
      req.baseUrl == '/api/swagger-docs.html' ||
      req.baseUrl == '/users/create'
    ) {
      next();
    } else {
      if (authorization) {
        const token = authorization.split(' ')[1];
        if (!authorization.toString().startsWith('Bearer '))
          throw new UnauthorizedException('The provided token is invalid');
        const { tokenVerified, error } = this.jwtService.verify(token, {
          secret: this.configService.get('SECRET_KEY'),
        });
        if (error) throw new UnauthorizedException(error.message);
        const details: any = await this.jwtService.decode(token);
        const user = await this.userService.getUserById(details.id, 'User');
        req['user'] = user;
        next();
      } else {
        console.log(req.baseUrl);
        throw new UnauthorizedException(
          'Please you are not authorized to access resource',
        );
      }
    }
  }
}
