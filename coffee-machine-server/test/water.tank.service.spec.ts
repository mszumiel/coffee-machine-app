import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { WaterTankServiceImpl } from '../src/services/containers/water.tank.service.impl';

describe('CoffeeBeansContainerServiceImpl Service', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [WaterTankServiceImpl],
    }).compile();
  });

  it('should be defined', () => {
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    expect(serviceToTest).toBeDefined();
  });

  it('should get water from tank and return that is does not need refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) - 10;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    return serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
      .then((actualReceivedWaterInMilliliters: number) => {
        // then
        expect(actualReceivedWaterInMilliliters).toBe(givenRequiredWaterInMillilitersForTest);
        serviceToTest.isFillRequired()
          .then((isFillRequired: boolean) => {
            expect(isFillRequired).toBe(false);
          });
      });
  });

  it('should get water with size greater then capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) + 10;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    return serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
      .then((actualReceivedWaterInMilliliters: number) => {
        // then
        expect(actualReceivedWaterInMilliliters).toBe(0);
        serviceToTest.isFillRequired()
          .then((isFillRequired: boolean) => {
            expect(isFillRequired).toBe(true);
          });
      });
  });

  it('should get water with summarized size equal to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    return serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
      .then((actualReceivedWaterFirstTime: number) => {
        serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
          .then((actualReceivedWaterSecondTime: number) => {
            // then
            expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
            expect(actualReceivedWaterSecondTime).toBe(givenRequiredWaterInMillilitersForTest);
            serviceToTest.isFillRequired()
              .then((isFillRequired: boolean) => {
                expect(isFillRequired).toBe(true);
              });
          });
      });
  });

  it('should get water with summarized size greater to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    return serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
      .then((actualReceivedWaterFirstTime: number ) => {
        serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
          .then((actualReceivedWaterSecondTime: number ) => {
            serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
              .then((actualReceivedWaterThirdTime: number) => {
                // then
                expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
                expect(actualReceivedWaterSecondTime).toBe(givenRequiredWaterInMillilitersForTest);
                expect(actualReceivedWaterThirdTime).toBe(0);
                serviceToTest.isFillRequired()
                  .then((isFillRequired: boolean) => {
                    expect(isFillRequired).toBe(true);
                  });
              });
          });
      });
  });

  it('should get water with size greater then capacity from tank and after refill should return water', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest: number = appConfig.get('waterTankCapacityInMilliliters') as unknown as number;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    return serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
      .then((actualReceivedWaterFirstTime: number ) => {
        serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
          .then((water: number) => {
            serviceToTest.isFillRequired()
              .then((actualIsRefillNeededAfterSecond: boolean) => {
                serviceToTest.fillWithWater();
                serviceToTest.getWater(givenRequiredWaterInMillilitersForTest)
                  .then((actualReceivedWaterThirdTime: number ) => {
                    // then
                    expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
                    expect(actualIsRefillNeededAfterSecond).toBe(true);
                    expect(actualReceivedWaterThirdTime).toBe(givenRequiredWaterInMillilitersForTest);
                  });
              });
          });
      });
  });

});
