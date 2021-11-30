import { Module } from '@nestjs/common';
import { RaspberrypiService } from './raspberrypi.service';
import { RaspberrypiController } from './raspberrypi.controller';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [SongsModule],
  controllers: [RaspberrypiController],
  providers: [RaspberrypiService],
  exports: [RaspberrypiService],
})
export class RaspberrypiModule {}
