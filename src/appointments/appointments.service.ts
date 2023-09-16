/*eslint-disable */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from 'src/dtos/appointment.dto';
import { Appointment } from 'src/entitties/appointment.entity';
import { User } from 'src/entitties/user.entity';
import { Status } from 'src/enums/Status.enum';
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
      status: Status.PENDING,
    });

    return await this.appointRepo.save(appointment);
  }

  async rejectAppointment(appointmentId: number): Promise<string> {
    // check availability
    const appointment = await this.appointRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${appointmentId} not found!`);
    }

    if (appointment.status === Status.REJECTED) {
      throw new BadRequestException(
        `Appointment ${appointmentId} already rejected...`,
      );
    }

    appointment.status = Status.REJECTED;
    await this.appointRepo.save(appointment);
    return `Appointment ${appointmentId} REJECTED successfully...`;
  }

  async approveAppointment(appointmentId: number): Promise<string> {
    // Check availability
    const appointment = await this.appointRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${appointmentId} not found!`);
    }

    appointment.status = Status.APPROVED;
    await this.appointRepo.save(appointment);
    return `Appointment ${appointmentId} APPROVED successfully`;
  }
}
