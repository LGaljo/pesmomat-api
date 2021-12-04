import { Module } from '@nestjs/common';
import { RaspberrypiService } from './raspberrypi.service';
import { RaspberrypiController } from './raspberrypi.controller';
import { SongsModule } from '../songs/songs.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [SongsModule, TokensModule],
  controllers: [RaspberrypiController],
  providers: [RaspberrypiService],
  exports: [RaspberrypiService],
})
export class RaspberrypiModule {}
