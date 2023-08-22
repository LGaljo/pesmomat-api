import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratedPoem, GeneratedPoemsSchema } from './generate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeneratedPoem.name, schema: GeneratedPoemsSchema },
    ]),
  ],
  providers: [GenerateService],
  controllers: [GenerateController],
})
export class GenerateModule {}
