import { DiagnosticController } from '../src/diagnostic/diagnostic.controller';
import { ConfigService } from '../src/config/config.service';
import { DiagnosticService } from '../src/diagnostic/diagnostic.service';
import * as winston from 'winston';
import { Logger } from 'winston';
import { CleanerStatusProvider } from '../src/diagnostic/cleaner.status.provider';
import { CoffeePreparationStatusProvider } from '../src/services/coffee.preparation.status.provider';
import { PreparedCoffeesCountProvider } from '../src/services/prepared.coffees.count.provider';
import { CoffeeBeansContainerService } from '../src/services/containers/coffee.beans.container.service';
import { CoffeeGroundsContainerService } from '../src/services/containers/coffee.grounds.container.service';
import { WaterTankService } from '../src/services/containers/water.tank.service';
import { MachineStatusDto } from '../src/model/dto/machine.status.dto';

describe('Diagnostic Controller', () => {
  let diagnosticService: DiagnosticService;
  let diagnosticController: DiagnosticController;

  let mockedCleanerStatusProvider: CleanerStatusProvider;
  let mockedCoffeePreparationStatusProvider: CoffeePreparationStatusProvider;
  let mockedPreparedCoffeesCountProvider: PreparedCoffeesCountProvider;
  let mockedAppConfig: ConfigService;

  let mockedCoffeeBeansContainerService: CoffeeBeansContainerService;
  let mockedCoffeeGroundsContainerService: CoffeeGroundsContainerService;
  let mockedWaterTankService: WaterTankService;

  beforeEach(async () => {
    const logger: Logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' }),
      ]});

    mockedAppConfig = new ConfigService(`src/config/config-dev.env`);
    mockedCleanerStatusProvider = {
      isWorking: jest.fn(() => false),
    };
    mockedCoffeePreparationStatusProvider = {
      isPreparationInProgress: jest.fn(() => true),
    };
    mockedPreparedCoffeesCountProvider = {
      getNumberOfPreparedCoffees: jest.fn(() => 0),
    };
    mockedCoffeeBeansContainerService = {
      getBeans: jest.fn((requiredBeansInMilligrams) => requiredBeansInMilligrams),
      isFillRequired: jest.fn(() => false),
      fillWithBeans: jest.fn(() => {}),
    };
    mockedCoffeeGroundsContainerService = {
      fillWithGrounds: jest.fn((groundsInMilligrams) => true),
      isEmptiedRequired: jest.fn(() => false),
      emptyTheContainer: jest.fn(() => {}),
    };
    mockedWaterTankService = {
      getWater: jest.fn((requiredWaterInMilliliters) => requiredWaterInMilliliters),
      isFillRequired: jest.fn(() => false),
      fillWithWater: jest.fn(() => {}),
    };

    diagnosticService = new DiagnosticService(
      mockedCleanerStatusProvider, mockedCoffeePreparationStatusProvider,
      mockedCoffeeBeansContainerService, mockedCoffeeGroundsContainerService,
      mockedWaterTankService,
    );

    diagnosticController = new DiagnosticController(diagnosticService);
  });

  it('should return machine status', () => {
    // given
    // when
    const actualMachineStatus: MachineStatusDto = diagnosticController.getStatus();
    // then
    expect(actualMachineStatus.cleaningInProgress).toBe(false);
    expect(actualMachineStatus.coffeeBeansContainerEmpty).toBe(false);
    expect(actualMachineStatus.coffeeGroundsContainerFull).toBe(false);
    expect(actualMachineStatus.coffeePreparationInProgress).toBe(true);
    expect(actualMachineStatus.waterTankEmpty).toBe(false);
  });
});
