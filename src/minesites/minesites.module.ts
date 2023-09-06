import { Module } from '@nestjs/common';
import { MinesitesController } from './minesites.controller';
import { MinesitesService } from './minesites.service';

@Module({
  controllers: [MinesitesController],
  providers: [MinesitesService]
})
export class MinesitesModule {}
