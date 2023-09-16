/* eslint-disable */
import { Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home/home.controller';
import { MailingModule } from './mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entitties/user.entity';
import { Role } from './entitties/role.entity';
import { RoleService } from './roles/roles.service';
import { File } from './file/File';
import { EmployeesModule } from './employees/employees.module';
import { QuestionModule } from './question/question.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AppointmentsService } from './appointments/appointments.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // Import ConfigModule here
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Role, File],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    MailingModule,
    AuthModule,
    EmployeesModule,
    QuestionModule,
    AppointmentsModule,
  ],
  controllers: [AuthController, HomeController],
  providers: [AppointmentsService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly roleService: RoleService) {}
  
  async onModuleInit() {
    let roles = await this.roleService.getAllRoles();
    if (!roles || roles.length == 0) {
      this.roleService.createRoles();
    }
  }
}
