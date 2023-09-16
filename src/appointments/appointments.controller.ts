import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from 'src/dtos/appointment.dto';
import { Appointment } from 'src/entitties/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post('/create')
  async createAppointment(
    @Body() appointment: CreateAppointmentDto,
  ): Promise<{ data: Appointment; message: string; success: boolean }> {
    return {
      data: await this.appointmentService.createAppointment(appointment),
      message: 'Appointment placed successfully...',
      success: true,
    };
  }
}
