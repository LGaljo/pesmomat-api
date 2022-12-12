import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `Pesmomat API ${process.env.npm_package_version}`;
  }
}
