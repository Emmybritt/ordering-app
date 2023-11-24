import { Module } from '@nestjs/common';
import { BilingController } from './biling.controller';
import { BilingService } from './biling.service';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILING_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [BilingController],
  providers: [BilingService],
})
export class BilingModule {}
