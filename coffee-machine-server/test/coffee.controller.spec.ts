import { CoffeeController } from '../src/coffee/coffee.controller';
import * as winston from 'winston';
import { Logger } from 'winston';
import { CoffeeOrderDao } from '../src/dao/coffee.order.dao';
import { CoffeePreparationService } from '../src/services/coffee.preparation.service';
import { ConfigService } from '../src/config/config.service';
import { CoffeeOrderDaoInMemory } from '../src/dao/coffee.order.dao.in.memory';
import { CoffeeBeansContainerServiceImpl } from '../src/services/containers/coffee.beans.container.service.impl';
import { CoffeeGroundsContainerServiceImpl } from '../src/services/containers/coffee.grounds.container.service.impl';
import { MilkFeederServiceImpl } from '../src/services/containers/milk.feeder.service.impl';
import { WaterTankServiceImpl } from '../src/services/containers/water.tank.service.impl';
import { CoffeeService } from '../src/coffee/coffee.service';
import { CoffeeOrderDto } from '../src/model/dto/coffee.order.dto';
import { CoffeeOrder } from '../src/model/coffee.order';
import { CoffeeOrderStatus } from '../src/model/shared/coffee.order.status';
import { CoffeeRecipe } from '../src/model/coffee.recipe';
import { CleanerStatusProvider } from '../src/diagnostic/cleaner.status.provider';

describe('Coffee Controller', () => {
  let coffeeService: CoffeeService;
  let coffeeController: CoffeeController;

  let mockedCoffeeOrderDao: CoffeeOrderDao;
  let mockedCleanerStatusProvider: CleanerStatusProvider;
  let mockedCoffeePreparationService: CoffeePreparationService;
  let mockedAppConfig: ConfigService;

  beforeAll(async () => {
    const logger: Logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' }),
      ]});

    mockedCoffeeOrderDao = {
      save: jest.fn((coffeeRecipe: CoffeeRecipe, status: CoffeeOrderStatus) => Promise.resolve(null)),
      updateStatus: jest.fn((orderToUpdate: CoffeeOrder, statusToUpdate: CoffeeOrderStatus) => Promise.resolve(null)),
      findOne: jest.fn((coffeeOrderId: number) => Promise.resolve(null)),
    };
    mockedAppConfig = new ConfigService(`src/config/config-dev.env`);
    mockedCoffeePreparationService = new CoffeePreparationService(
      logger,
      mockedCoffeeOrderDao,
      mockedAppConfig,
      new CoffeeBeansContainerServiceImpl(mockedAppConfig),
      new CoffeeGroundsContainerServiceImpl(mockedAppConfig),
      new MilkFeederServiceImpl(),
      new WaterTankServiceImpl(mockedAppConfig),
    );
    mockedCleanerStatusProvider = {
      isWorking: jest.fn(() => Promise.resolve(false)),
    };
    coffeeService = new CoffeeService(
      logger,
      mockedCleanerStatusProvider,
      mockedCoffeeOrderDao,
      mockedCoffeePreparationService,
    );
    coffeeController = new CoffeeController(coffeeService);
  });

  it('should get coffee status return status NOT_ORDERED when no coffee order saved', () => {
    // given
    const expectedId = 1;
    const expectedStatus = 'NOT_ORDERED';
    jest.spyOn(mockedCoffeeOrderDao, 'findOne').mockImplementation(() => Promise.resolve(null));
    // when
    return coffeeController.getStatus(1)
      .then((actualCoffeeOrder: CoffeeOrderDto) => {
        // then
        expect(actualCoffeeOrder.id).toBe(expectedId);
        expect(actualCoffeeOrder.status).toBe(expectedStatus);
      });
  });

  it('should get coffee status return status when coffee order saved', () => {
    // given
    const coffeeOrderToReturn: CoffeeOrder = new CoffeeOrder(
      1, CoffeeOrderStatus.IN_PROGRESS,
      5, 5,
      5, 5);
    jest.spyOn(mockedCoffeeOrderDao, 'findOne').mockImplementation(() => Promise.resolve(coffeeOrderToReturn));
    // when
    return coffeeController.getStatus(1)
      .then((actualCoffeeOrder: CoffeeOrderDto) => {
        // then
        expect(actualCoffeeOrder.id).toBe(coffeeOrderToReturn.id);
        expect(actualCoffeeOrder.status).toBe(CoffeeOrderStatus[coffeeOrderToReturn.status]);
      });
  });

});
