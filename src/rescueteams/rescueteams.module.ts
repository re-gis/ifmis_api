import { Module } from '@nestjs/common';
import { RescueteamsController } from './rescueteams.controller';
import { RescueteamsService } from './rescueteams.service';

@Module({
  controllers: [RescueteamsController],
  providers: [RescueteamsService]
})
export class RescueteamsModule {}
