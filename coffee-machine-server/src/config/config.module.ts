import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`src/config/config-dev.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
