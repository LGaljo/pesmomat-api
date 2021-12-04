import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokensSchema } from './tokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokensSchema }]),
  ],
  providers: [TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
