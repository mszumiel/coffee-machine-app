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
    return serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
      .then((actualReceivedBeansInMilligrams: number ) => {
        // then
        expect(actualReceivedBeansInMilligrams).toBe(givenRequiredBeansInMilligramsForTest);
        serviceToTest.isFillRequired()
          .then((isFillRequired: boolean) => {
            expect(isFillRequired).toBe(false);
          });
      });
  });

  it('should get beans with size greater then capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) + 10;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    return serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
      .then((actualReceivedBeansInMilligrams: number) => {
        // then
        expect(actualReceivedBeansInMilligrams).toBe(0);
        serviceToTest.isFillRequired()
          .then((isFillRequired: boolean) => {
            expect(isFillRequired).toBe(true);
          });
      });
  });

  it('should get beans with summarized size equal to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    return serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
      .then((actualReceivedBeansFirstTime: number) => {
        serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
          .then((actualReceivedBeansSecondTime: number ) => {
            // then
            expect(actualReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
            expect(actualReceivedBeansSecondTime).toBe(givenRequiredBeansInMilligramsForTest);
            serviceToTest.isFillRequired()
              .then((isFillRequired: boolean) => {
                expect(isFillRequired).toBe(true);
              });
          });
      });
  });

  it('should get beans with summarized size greater to capacity from container and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest = (appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number) / 2;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    return serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
      .then((givenReceivedBeansFirstTime: number) => {
        serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
          .then((givenReceivedBeansSecondTime: number) => {
            serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
              .then((givenReceivedBeansThirdTime: number ) => {
                // then
                expect(givenReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
                expect(givenReceivedBeansSecondTime).toBe(givenRequiredBeansInMilligramsForTest);
                expect(givenReceivedBeansThirdTime).toBe(0);
                serviceToTest.isFillRequired()
                  .then((isFillRequired: boolean) => {
                    expect(isFillRequired).toBe(true);
                  });
              });
          });
      });
  });

  it('should get beans with size greater then capacity from container and after refill should return beans', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredBeansInMilligramsForTest: number = appConfig.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number;
    const serviceToTest: CoffeeBeansContainerServiceImpl = module.get<CoffeeBeansContainerServiceImpl>(CoffeeBeansContainerServiceImpl);
    serviceToTest.fillWithBeans();
    // when
    return serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
      .then((actualReceivedBeansFirstTime: number) => {
        serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest);
        serviceToTest.isFillRequired()
          .then((actualIsRefillNeededAfterSecond: boolean) => {
            serviceToTest.fillWithBeans();
            serviceToTest.getBeans(givenRequiredBeansInMilligramsForTest)
              .then((actualReceivedBeansThirdTime: number ) => {
                // then
                expect(actualReceivedBeansFirstTime).toBe(givenRequiredBeansInMilligramsForTest);
                expect(actualIsRefillNeededAfterSecond).toBe(true);
                expect(actualReceivedBeansThirdTime).toBe(givenRequiredBeansInMilligramsForTest);
              });
          });
      });
  });

});
