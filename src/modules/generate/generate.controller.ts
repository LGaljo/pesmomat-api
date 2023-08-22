import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly service: GenerateService) {}

  @Post()
  public async generatePoem(@Body() options: any): Promise<any> {
    return this.service.generatePoem(options);
  }
}
