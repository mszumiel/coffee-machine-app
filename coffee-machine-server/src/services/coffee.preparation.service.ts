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

    if (coffeeOrderToPrepare == null || coffeeOrderToPrepare === undefined) {
      this.logger.error('coffee order with id ' + coffeeOrderId + ' does not exists');
      return;
    }

    const milkSizeInMilliliters = (coffeeOrderToPrepare.milkInPercentage * this.coffeeCupSizeInMilliliters) / 100;
    const waterSizeInMilliliters = (coffeeOrderToPrepare.waterInPercentage * this.coffeeCupSizeInMilliliters) / 100;

    this.logger.debug('prepare coffee with milk in milliliters ' + milkSizeInMilliliters + ' and water in milliliters ' + waterSizeInMilliliters);

    if (this.coffeeBeansContainerService.isFillRequired() ||
      this.waterTankService.isFillRequired() ||
      this.coffeeGroundsContainerService.isEmptiedRequired()) {
      this.logger.error('coffee beans full, water tank empty or coffee grounds full -> coffee cannot be prepared');
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      return;
    }

    this.coffeePreparationInProgress = true;

    const retrievedBeansInMilligrams = this.coffeeBeansContainerService.getBeans(coffeeOrderToPrepare.coffeeBeansInMilligrams);
    this.logger.info('retrieve ' + retrievedBeansInMilligrams + ' mg of coffee beans');
    if (retrievedBeansInMilligrams === 0 && this.coffeeBeansContainerService.isFillRequired()) {
      this.logger.error('coffee beans full -> coffee cannot be prepared');
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      this.coffeePreparationInProgress = false;
      return;
    }

    const retrievedMilkInMilliliters = this.milkFeederService.getMilk(milkSizeInMilliliters);
    this.logger.info('retrieve ' + retrievedMilkInMilliliters + ' ml of milk');

    const retrievedWaterInMilliliters = this.waterTankService.getWater(waterSizeInMilliliters);
    this.logger.info('retrieve ' + retrievedWaterInMilliliters + ' ml of water');
    if (retrievedWaterInMilliliters === 0 && this.waterTankService.isFillRequired()) {
      this.logger.error('water tank empty -> coffee cannot be prepared');
      await this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
      this.coffeePreparationInProgress = false;
      return;
    }

    this.logger.info('start coffee brewing');
    setTimeout(() => {
      if (this.coffeeGroundsContainerService.isEmptiedRequired()) {
        this.logger.error('coffee grounds full -> coffee cannot be prepared');
        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
        this.coffeePreparationInProgress = false;
        return;
      }
      this.coffeeGroundsContainerService.fillWithGrounds(retrievedBeansInMilligrams);
      this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.DONE);
      this.coffeePreparationInProgress = false;
      this.logger.info('coffee preparation finished');
    }, coffeeOrderToPrepare.timeOfBrewingInSeconds * 1000);

  }

  getNumberOfPreparedCoffees(): number {
    return this.numberOfPreparedCoffees;
  }

  isPreparationInProgress(): boolean {
    return this.coffeePreparationInProgress;
  }

}
