import { Module } from '@nestjs/common';
import { CoffeeGroundsContainerServiceImpl } from './containers/coffee.grounds.container.service.impl';
import { CoffeeBeansContainerServiceImpl } from './containers/coffee.beans.container.service.impl';
import { CoffeePreparationService } from './coffee.preparation.service';
import { MilkFeederServiceImpl } from './containers/milk.feeder.service.impl';
import { WaterTankServiceImpl } from './containers/water.tank.service.impl';
import { ConfigModule } from '../config/config.module';
import { DaoModule } from '../dao/dao.module';
import { MachineCleanerService } from './machine.cleaner.service';
import { CoffeeOrderDaoInMemory } from '../dao/coffee.order.dao.in.memory';
import { ContainersModule } from './containers/containers.module';

@Module({
  imports: [
    ConfigModule,
    ContainersModule,
    DaoModule,
  ],
  providers: [
    CoffeePreparationService,
    MachineCleanerService,
    {
      provide: 'CoffeeOrderDao',
      useClass: CoffeeOrderDaoInMemory,
    },
    {
      provide: 'CoffeeBeansContainerService',
      useClass: CoffeeBeansContainerServiceImpl,
    },
    {
      provide: 'CoffeeGroundsContainerService',
      useClass: CoffeeGroundsContainerServiceImpl,
    },
    {
      provide: 'MilkFeederService',
      useClass: MilkFeederServiceImpl,
    },
    {
      provide: 'WaterTankService',
      useClass: WaterTankServiceImpl,
    },
    {
      provide: 'CoffeePreparationStatusProvider',
      useClass: CoffeePreparationService,
    },
    {
      provide: 'PreparedCoffeesCountProvider',
      useClass: CoffeePreparationService,
    },
  ],
  exports: [
    MachineCleanerService,
    CoffeePreparationService,
  ],
})
export class SharedServicesModule {}
