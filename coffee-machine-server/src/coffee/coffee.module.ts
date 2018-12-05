import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { SharedServicesModule } from '../services/shared.services.module';
import { DaoModule } from '../dao/dao.module';
import { CoffeeOrderDaoInMemory } from '../dao/coffee.order.dao.in.memory';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    SharedServicesModule,
  ],
  controllers: [CoffeeController],
  providers: [
    CoffeeService,
  ],
})
export class CoffeeModule {}
