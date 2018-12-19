import {Inject, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {ConfigService} from '../config/config.service';
import {CoffeeOrderStatus} from '../model/shared/coffee.order.status';
import {CoffeeOrderDao} from '../dao/coffee.order.dao';
import {PreparedCoffeesCountProvider} from './prepared.coffees.count.provider';
import {CoffeePreparationStatusProvider} from './coffee.preparation.status.provider';
import {Logger} from 'winston';
import {CoffeeBeansContainerService} from './containers/coffee.beans.container.service';
import {CoffeeGroundsContainerService} from './containers/coffee.grounds.container.service';
import {WaterTankService} from './containers/water.tank.service';
import {MilkFeederService} from './containers/milk.feeder.service';

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
        this.coffeeOrderDao.findOne(coffeeOrderId)
            .then(coffeeOrderToPrepare => {
                if (coffeeOrderToPrepare == null || coffeeOrderToPrepare === undefined) {
                    this.logger.error('coffee order with id ' + coffeeOrderId + ' does not exists');
                    return;
                }

                const milkSizeInMilliliters = (coffeeOrderToPrepare.milkInPercentage * this.coffeeCupSizeInMilliliters) / 100;
                const waterSizeInMilliliters = (coffeeOrderToPrepare.waterInPercentage * this.coffeeCupSizeInMilliliters) / 100;

                this.logger.debug('prepare coffee with milk in milliliters ' + milkSizeInMilliliters + ' and water in milliliters ' + waterSizeInMilliliters);

                Promise.all([
                    this.coffeeBeansContainerService.isFillRequired(),
                    this.waterTankService.isFillRequired(),
                    this.coffeeGroundsContainerService.isEmptiedRequired()
                ]).then(responses => {
                    if (responses[0] || responses[1] || responses[2]) {
                        this.logger.error('coffee beans full, water tank empty or coffee grounds full -> coffee cannot be prepared');
                        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
                        return;
                    }

                    this.coffeePreparationInProgress = true;

                    this.coffeeBeansContainerService.getBeans(coffeeOrderToPrepare.coffeeBeansInMilligrams)
                        .then(retrievedBeansInMilligrams => {
                            this.logger.info('retrieve ' + retrievedBeansInMilligrams + ' mg of coffee beans');

                            this.coffeeBeansContainerService.isFillRequired()
                                .then(isCoffeeBeansContainerFillRequired => {
                                    if (retrievedBeansInMilligrams === 0 && isCoffeeBeansContainerFillRequired) {
                                        this.logger.error('coffee beans full -> coffee cannot be prepared');
                                        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
                                        this.coffeePreparationInProgress = false;
                                        return;
                                    }

                                    Promise.all([
                                        this.milkFeederService.getMilk(milkSizeInMilliliters),
                                        this.waterTankService.getWater(waterSizeInMilliliters)
                                    ]).then(responses => {
                                        const retrievedWaterInMilliliters = responses[1];
                                        this.logger.info('retrieve ' + retrievedWaterInMilliliters + ' ml of water');
                                        if (retrievedWaterInMilliliters === 0 && this.waterTankService.isFillRequired()) {
                                            this.logger.error('water tank empty -> coffee cannot be prepared');
                                            this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
                                            this.coffeePreparationInProgress = false;
                                            return;
                                        }

                                        this.logger.info('start coffee brewing');
                                        setTimeout(() => {
                                            this.coffeeGroundsContainerService.isEmptiedRequired()
                                                .then(isEmptiedRequired => {
                                                    if (isEmptiedRequired) {
                                                        this.logger.error('coffee grounds full -> coffee cannot be prepared');
                                                        this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.INTERRUPTED);
                                                        this.coffeePreparationInProgress = false;
                                                        return;
                                                    }
                                                    this.coffeeGroundsContainerService.fillWithGrounds(retrievedBeansInMilligrams)
                                                        .then(() => {
                                                            this.coffeeOrderDao.updateStatus(coffeeOrderToPrepare, CoffeeOrderStatus.DONE);
                                                            this.coffeePreparationInProgress = false;
                                                            this.logger.info('coffee preparation finished');
                                                        });
                                                });
                                        }, coffeeOrderToPrepare.timeOfBrewingInSeconds * 1000);
                                    });
                                });
                        });
                });
            });
    }


    getNumberOfPreparedCoffees(): Promise<number> {
        return new Promise<number>(resolve => resolve(this.numberOfPreparedCoffees));
    }

    isPreparationInProgress(): Promise<boolean> {
        return new Promise<boolean>(resolve => resolve(this.coffeePreparationInProgress));
    }

}
