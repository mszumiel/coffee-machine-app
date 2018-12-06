import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeBeansContainerServiceImpl } from '../src/services/containers/coffee.beans.container.service.impl';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';

describe('CoffeeBeansContainerServiceImpl Service', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CoffeeBeansContainerServiceImpl],
    }).compile();
  });

  it('should be defined', () => {
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    expect(serviceToTest).toBeDefined();
  });

  it('should get beans from container and return that is does not need refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) - 10;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const actualReceivedBeansInMilligrams = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    // then
    expect(actualReceivedBeansInMilligrams).toBe(givenRequiredBeansInMilligramsForTest);
    expect(serviceToTest.isFillRequired()).toBe(false);
  });

  it('should get beans with size greater then capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) + 10;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const actualReceivedBeansInMilligrams = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    // then
    expect(actualReceivedBeansInMilligrams).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with summarized size equal to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const actualReceivedBeansFirstTime = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    const actualReceivedBeansSecondTime = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    // then
    expect(actualReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
    expect(actualReceivedBeansSecondTime).toBe(givenRequiredBeansInMilligramsForTest);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with summarized size greater to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const givenReceivedBeansFirstTime = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    const givenReceivedBeansSecondTime = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    const givenReceivedBeansThirdTime = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    // then
    expect(givenReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
    expect(givenReceivedBeansSecondTime).toBe(givenRequiredBeansInMilligramsForTest);
    expect(givenReceivedBeansThirdTime).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with size greater then capacity from container and after refill should return beans', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest: number = appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const actualReceivedBeansFirstTime: number = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    const actualIsRefillNeededAfterSecond: boolean = serviceToTest.isFillRequired();
    serviceToTest.fillWithBeans();
    const actualReceivedBeansThirdTime: number = serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
    // then
    expect(actualReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
    expect(actualIsRefillNeededAfterSecond).toBe(true);
    expect(actualReceivedBeansThirdTime).toBe(givenRequiredBeansInMilligramsForTest);
  });

});
