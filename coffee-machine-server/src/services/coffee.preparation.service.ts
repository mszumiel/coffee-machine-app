import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CoffeeOrder } from '../model/coffee.order';
import { ConfigService } from '../config/config.service';
import { CoffeeOrderStatus } from '../model/shared/coffee.order.status';
import { CoffeeOrderDao } from '../dao/coffee.order.dao';
import { PreparedCoffeesCountProvider } from './prepared.coffees.count.provider';
import { CoffeePreparationStatusProvider } from './coffee.preparation.status.provider';
import { Logger } from 'winston';
import { CoffeeBeansContainerService } from './containers/coffee.beans.container.service';
import { CoffeeGroundsContainerService } from './containers/coffee.grounds.container.service';
import { WaterTankService } from './containers/water.tank.service';
import { MilkFeederService } from './containers/milk.feeder.service';

@Injectable()
export class CoffeePreparationService implements PreparedCoffeesCountProvider, CoffeePreparationStatusProvider {

  readonly coffeeCupSizeInMilliliters: number;
  numberOfPreparedCoffees = 0;
  coffeePreparationInProgress = false;

  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject('CoffeeOrderDaoInMemory') private readonly coffeeOrderDao: CoffeeOrderDao,
    appConfig: ConfigService,
    @Inject('CoffeeBeansContainerService') private readonly coffeeBeansContainerService: CoffeeBeansContainerService,
    @Inject('CoffeeGroundsContainerService') private readonly coffeeGroundsContainerService: CoffeeGroundsContainerService,
    @Inject('MilkFeederService') private readonly milkFeederService: MilkFeederService,
    @Inject('WaterTankService') private readonly waterTankService: WaterTankService,
  ) {
    this.coffeeCupSizeInMilliliters = appConfig.get('coffeeCupCapacityInMilliliters') as unknown as number;
  }

  async prepareCoffee(coffeeOrderId: number) {
    this.logger.debug('prepare coffee for id ' + coffeeOrderId);
    const coffeeOrderToPrepare: CoffeeOrder = this.coffeeOrderDao.findOne(coffeeOrderId);
    const milkSizeInMilliliters = (coffeeOrderToPrepare.milkInPercentage * this.coffeeCupSizeInMilliliters) / 100;
    const waterSizeInMilliliters = (coffeeOrderToPrepare.waterInPercentage * this.coffeeCupSizeInMilliliters) / 100;

    if (this.coffeeBeansContainerService.isFillRequired() ||
      this.waterTankService.isFillRequired() ||
      this.coffeeGroundsContainerService.isEmptiedRequired()) {
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      return;
    }

    this.coffeePreparationInProgress = true;

    const retrievedBeansInMilligrams = this.coffeeBeansContainerService.getBeans(coffeeOrderToPrepare.coffeeBeansInMilligrams);
    if (retrievedBeansInMilligrams === 0 && this.coffeeBeansContainerService.isFillRequired()) {
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      this.coffeePreparationInProgress = false;
      return;
    }

    this.milkFeederService.getMilk(milkSizeInMilliliters);

    const retrievedWaterInMilliliters = this.waterTankService.getWater(waterSizeInMilliliters);
    if (retrievedWaterInMilliliters === 0 && this.waterTankService.isFillRequired()) {
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      this.coffeePreparationInProgress = false;
      return;
    }

    setTimeout(() => {
      if (this.coffeeGroundsContainerService.isEmptiedRequired()) {
        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
        this.coffeePreparationInProgress = false;
        return;
      }
      this.coffeeGroundsContainerService.fillWithGrounds(retrievedBeansInMilligrams);
      this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.DONE);
      this.coffeePreparationInProgress = false;
    }, coffeeOrderToPrepare.timeOfBrewingInSeconds * 1000);

  }

  getNumberOfPreparedCoffees(): number {
    return this.numberOfPreparedCoffees;
  }

  isPreparationInProgress(): boolean {
    return this.coffeePreparationInProgress;
  }

}
