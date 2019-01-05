import { ConfigService } from '../src/config/config.service';
import { CoffeePreparationService } from '../src/services/coffee.preparation.service';
import * as winston from 'winston';
import { Logger } from 'winston';
import { CoffeeOrderDao } from '../src/dao/coffee.order.dao';
import { CoffeeBeansContainerService } from '../src/services/containers/coffee.beans.container.service';
import { CoffeeGroundsContainerService } from '../src/services/containers/coffee.grounds.container.service';
import { MilkFeederService } from '../src/services/containers/milk.feeder.service';
import { WaterTankService } from '../src/services/containers/water.tank.service';
import { CoffeeRecipe } from '../src/model/coffee.recipe';
import { CoffeeOrderStatus } from '../src/model/shared/coffee.order.status';
import { CoffeeOrder } from '../src/model/coffee.order';

describe('CoffeeBeansContainerServiceImpl Service', () => {
  let serviceToTest: CoffeePreparationService;

  let mockedAppConfig: ConfigService;
  let mockedCoffeeOrderDao: CoffeeOrderDao;
  let mockedCoffeeBeansContainerService: CoffeeBeansContainerService;
  let mockedCoffeeGroundsContainerService: CoffeeGroundsContainerService;
  let mockedMilkFeederService: MilkFeederService;
  let mockedWaterTankService: WaterTankService;

  beforeEach(async () => {
    const logger: Logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' })
      ]
    });
    mockedAppConfig = new ConfigService(`src/config/config-dev.env`);
    mockedCoffeeOrderDao = {
      save: jest.fn(() => Promise.resolve(null)),
      updateStatus: jest.fn(() => Promise.resolve(null)),
      findOne: jest.fn(() => Promise.resolve(null))
    };
    mockedCoffeeBeansContainerService = {
      getBeans: jest.fn((requiredBeansInMilligrams) => Promise.resolve(requiredBeansInMilligrams)),
      isFillRequired: jest.fn(() => Promise.resolve(false)),
      fillWithBeans: jest.fn(() => {
      }),
    };
    mockedCoffeeGroundsContainerService = {
      fillWithGrounds: jest.fn(() => Promise.resolve(true)),
      isEmptiedRequired: jest.fn(() => Promise.resolve(false)),
      emptyTheContainer: jest.fn(() => {
      }),
    };
    mockedWaterTankService = {
      getWater: jest.fn((requiredWaterInMilliliters) => Promise.resolve(requiredWaterInMilliliters)),
      isFillRequired: jest.fn(() => Promise.resolve(false)),
      fillWithWater: jest.fn(() => {
      }),
    };
    mockedMilkFeederService = {
      getMilk: jest.fn(() => Promise.resolve(false)),
    };

    serviceToTest = new CoffeePreparationService(
      logger, mockedCoffeeOrderDao, mockedAppConfig,
      mockedCoffeeBeansContainerService, mockedCoffeeGroundsContainerService,
      mockedMilkFeederService, mockedWaterTankService
    );

  });

  it('should set coffee order status to INTERRUPTED if coffee beans container is empty', () => {
    // given
    const givenCoffeeOrder: CoffeeOrder = new CoffeeOrder(1, CoffeeOrderStatus.IN_PROGRESS, 50, 50, 20, 2);
    jest.spyOn(mockedCoffeeBeansContainerService, 'isFillRequired').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(mockedCoffeeOrderDao, 'findOne').mockImplementation(() => Promise.resolve(givenCoffeeOrder));
    // when
    return serviceToTest.prepareCoffee(givenCoffeeOrder.id)
      .then(() => {
        // then
        expect(mockedCoffeeOrderDao.updateStatus).toHaveBeenCalledWith(givenCoffeeOrder, CoffeeOrderStatus.INTERRUPTED);
      });
  });

  it('should set coffee order status to INTERRUPTED if coffee grounds container is full', () => {
    // given
    const givenCoffeeOrder: CoffeeOrder = new CoffeeOrder(1, CoffeeOrderStatus.IN_PROGRESS, 50, 50, 20, 2);
    jest.spyOn(mockedCoffeeGroundsContainerService, 'isEmptiedRequired').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(mockedCoffeeOrderDao, 'findOne').mockImplementation(() => Promise.resolve(givenCoffeeOrder));
    // when
    return serviceToTest.prepareCoffee(givenCoffeeOrder.id)
      .then(() => {
        // then
        expect(mockedCoffeeOrderDao.updateStatus).toBeCalledWith(givenCoffeeOrder, CoffeeOrderStatus.INTERRUPTED);
      });
  });

  it('should set coffee order status to INTERRUPTED if water tank is empty', () => {
    // given
    const givenCoffeeOrder: CoffeeOrder = new CoffeeOrder(1, CoffeeOrderStatus.IN_PROGRESS, 50, 50, 20, 2);
    jest.spyOn(mockedWaterTankService, 'isFillRequired').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(mockedCoffeeOrderDao, 'findOne').mockImplementation(() => Promise.resolve(givenCoffeeOrder));
    // when
    return serviceToTest.prepareCoffee(givenCoffeeOrder.id)
      .then(() => {
        // then
        expect(mockedCoffeeOrderDao.updateStatus).toBeCalledWith(givenCoffeeOrder, CoffeeOrderStatus.INTERRUPTED);
      });
  });

});
