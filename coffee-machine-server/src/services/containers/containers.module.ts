import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { CoffeeGroundsContainerServiceImpl } from './coffee.grounds.container.service.impl';
import { MilkFeederServiceImpl } from './milk.feeder.service.impl';
import { WaterTankServiceImpl } from './water.tank.service.impl';
import { CoffeeBeansContainerServiceImpl } from './coffee.beans.container.service.impl';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    CoffeeGroundsContainerServiceImpl,
    CoffeeBeansContainerServiceImpl,
    MilkFeederServiceImpl,
    WaterTankServiceImpl,
  ],
  exports: [
    CoffeeGroundsContainerServiceImpl,
    CoffeeBeansContainerServiceImpl,
    MilkFeederServiceImpl,
    WaterTankServiceImpl,
  ],
})
export class ContainersModule {}
