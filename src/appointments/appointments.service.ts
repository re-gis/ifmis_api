import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from 'src/dtos/appointment.dto';
import { Appointment } from 'src/entitties/appointment.entity';
import { User } from 'src/entitties/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    if (!dto.appointmentDate || !dto.title || !dto.userId) {
      throw new BadRequestException('All appointment details are required!');
    }

    const appointment = this.appointRepo.create({
      title: dto.title,
      description: dto.description,
      appointmentDate: dto.appointmentDate,
      user: {
        id: dto.userId,
      },
    });

    return await this.appointRepo.save(appointment);
  }
}
