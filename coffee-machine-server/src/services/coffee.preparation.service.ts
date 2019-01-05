import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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
import { CoffeeOrder } from '../model/coffee.order';

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

  public async prepareCoffee(coffeeOrderId: number) {
    this.logger.debug('prepare coffee for id ' + coffeeOrderId);
    return this.coffeeOrderDao.findOne(coffeeOrderId)
      .then((coffeeOrderToPrepare: CoffeeOrder) => {

        if (coffeeOrderToPrepare == null || coffeeOrderToPrepare === undefined) {
          this.logger.error('coffee order with id ' + coffeeOrderId + ' does not exists');
          return;
        }

        const milkSizeInMilliliters: number = (coffeeOrderToPrepare.milkInPercentage * this.coffeeCupSizeInMilliliters) / 100;
        const waterSizeInMilliliters: number = (coffeeOrderToPrepare.waterInPercentage * this.coffeeCupSizeInMilliliters) / 100;

        this.logger.debug('prepare coffee with milk in milliliters ' + milkSizeInMilliliters + ' and water in milliliters ' + waterSizeInMilliliters);

        return Promise.all([
          this.coffeeBeansContainerService.isFillRequired(),
          this.waterTankService.isFillRequired(),
          this.coffeeGroundsContainerService.isEmptiedRequired(),
        ]).then((responses) => {

          if (responses[0] || responses[1] || responses[2]) {
            this.logger.error('coffee beans full, water tank empty or coffee grounds full -> coffee cannot be prepared');
            this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED)
              .then(() => {
                return;
              });
          } else {
            return this.startCoffeePreparation(coffeeOrderToPrepare, milkSizeInMilliliters, waterSizeInMilliliters);
          }

        });
      });
  }

  private async startCoffeePreparation(coffeeOrderToPrepare: CoffeeOrder, milkSizeInMilliliters: number, waterSizeInMilliliters: number) {
    this.coffeePreparationInProgress = true;
    return this.getBeansForCoffee(coffeeOrderToPrepare, milkSizeInMilliliters, waterSizeInMilliliters);
  }

  private async getBeansForCoffee(coffeeOrderToPrepare: CoffeeOrder, milkSizeInMilliliters: number, waterSizeInMilliliters: number) {
    return this.coffeeBeansContainerService.getBeans(coffeeOrderToPrepare.coffeeBeansInMilligrams)
      .then((retrievedBeansInMilligrams: number) => {
        this.logger.info('retrieve ' + retrievedBeansInMilligrams + ' mg of coffee beans');

        this.coffeeBeansContainerService.isFillRequired()
          .then(isCoffeeBeansContainerFillRequired => {
            if (retrievedBeansInMilligrams === 0 && isCoffeeBeansContainerFillRequired) {
              this.logger.error('coffee beans full -> coffee cannot be prepared');
              this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED)
                .then(() => {
                  this.coffeePreparationInProgress = false;
                  return;
                });
            }
            return this.getMilkAndWaterForCoffee(coffeeOrderToPrepare, milkSizeInMilliliters, waterSizeInMilliliters, retrievedBeansInMilligrams);
          });
      });
  }

  private async getMilkAndWaterForCoffee(coffeeOrderToPrepare: CoffeeOrder, milkSizeInMilliliters: number, waterSizeInMilliliters: number,
                                         retrievedBeansInMilligrams: number) {
    Promise.all([
      this.milkFeederService.getMilk(milkSizeInMilliliters),
      this.waterTankService.getWater(waterSizeInMilliliters),
    ]).then(responses => {
      const retrievedWaterInMilliliters = responses[1];
      this.logger.info('retrieve ' + retrievedWaterInMilliliters + ' ml of water');
      if (retrievedWaterInMilliliters === 0 && this.waterTankService.isFillRequired()) {
        this.logger.error('water tank empty -> coffee cannot be prepared');
        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED)
          .then(() => {
            this.coffeePreparationInProgress = false;
            return;
          });
      }
      return this.startBrewingCoffee(coffeeOrderToPrepare, retrievedBeansInMilligrams);
    });
  }

  private async startBrewingCoffee(coffeeOrderToPrepare: CoffeeOrder, retrievedBeansInMilligrams: number) {
    this.logger.info('start coffee brewing');
    setTimeout(() => {
      this.coffeeGroundsContainerService.isEmptiedRequired()
        .then(isEmptiedRequired => {
          if (isEmptiedRequired) {
            this.logger.error('coffee grounds full -> coffee cannot be prepared');
            this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED)
              .then(() => {
                this.coffeePreparationInProgress = false;
                return;
              });
          }
          this.coffeeGroundsContainerService.fillWithGrounds(retrievedBeansInMilligrams)
            .then(() => {
              this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.DONE)
                .then(() => {
                  this.coffeePreparationInProgress = false;
                  this.logger.info('coffee preparation finished');
                });
            });
        });
    }, coffeeOrderToPrepare.timeOfBrewingInSeconds * 1000);
  }

  public getNumberOfPreparedCoffees(): Promise<number> {
    return Promise.resolve(this.numberOfPreparedCoffees);
  }

  public isPreparationInProgress(): Promise<boolean> {
    return Promise.resolve(this.coffeePreparationInProgress);
  }

}
