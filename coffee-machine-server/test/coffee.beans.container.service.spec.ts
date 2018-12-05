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
    const requiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) - 10;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const receivedBeansInMilligrams = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    // then
    expect(receivedBeansInMilligrams).toBe(requiredBeansInMilligramsForTest);
    expect(serviceToTest.isFillRequired()).toBe(false);
  });

  it('should get beans with size greater then capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) + 10;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const receivedBeansInMilligrams = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    // then
    expect(receivedBeansInMilligrams).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with summarized size equal to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const receivedBeansFirstTime = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    const receivedBeansSecondTime = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    // then
    expect(receivedBeansFirstTime).toBe(requiredBeansInMilligramsForTest);
    expect(receivedBeansSecondTime).toBe(requiredBeansInMilligramsForTest);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with summarized size greater to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const receivedBeansFirstTime = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    const receivedBeansSecondTime = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    const receivedBeansThirdTime = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    // then
    expect(receivedBeansFirstTime).toBe(requiredBeansInMilligramsForTest);
    expect(receivedBeansSecondTime).toBe(requiredBeansInMilligramsForTest);
    expect(receivedBeansThirdTime).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get beans with size greater then capacity from container and after refill should return beans', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredBeansInMilligramsForTest: number = appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    const receivedBeansFirstTime: number = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    const isRefillNeededAfterSecond: boolean = serviceToTest.isFillRequired();
    serviceToTest.fillWithBeans();
    const receivedBeansThirdTime: number = serviceToTest.getBeans(requiredBeansInMilligramsForTest);
    // then
    expect(receivedBeansFirstTime).toBe(requiredBeansInMilligramsForTest);
    expect(isRefillNeededAfterSecond).toBe(true);
    expect(receivedBeansThirdTime).toBe(requiredBeansInMilligramsForTest);
  });

});
