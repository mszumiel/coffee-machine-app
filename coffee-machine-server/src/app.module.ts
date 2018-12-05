import { Module } from '@nestjs/common';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { CoffeeModule } from './coffee/coffee.module';
import { ConfigModule } from './config/config.module';
import { SharedServicesModule } from './services/shared.services.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule,
    SharedServicesModule,
    DiagnosticModule,
    CoffeeModule,
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.prettyPrint(),
      transports: [
        new winston.transports.Console(),
      ],
    }),
  ],
})
export class AppModule {

}
