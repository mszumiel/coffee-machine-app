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
    const actualReceivedWaterInMilliliters = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    // then
    expect(actualReceivedWaterInMilliliters).toBe(givenRequiredWaterInMillilitersForTest);
    expect(serviceToTest.isFillRequired()).toBe(false);
  });

  it('should get water with size greater then capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) + 10;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const actualReceivedWaterInMilliliters = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    // then
    expect(actualReceivedWaterInMilliliters).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with summarized size equal to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const actualReceivedWaterFirstTime = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    const actualReceivedWaterSecondTime = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    // then
    expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
    expect(actualReceivedWaterSecondTime).toBe(givenRequiredWaterInMillilitersForTest);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with summarized size greater to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const actualReceivedWaterFirstTime = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    const actualReceivedWaterSecondTime = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    const actualReceivedWaterThirdTime = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    // then
    expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
    expect(actualReceivedWaterSecondTime).toBe(givenRequiredWaterInMillilitersForTest);
    expect(actualReceivedWaterThirdTime).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with size greater then capacity from tank and after refill should return water', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const givenRequiredWaterInMillilitersForTest: number = appConfig.get('waterTankCapacityInMilliliters') as unknown as number;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const actualReceivedWaterFirstTime: number = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    const actualIsRefillNeededAfterSecond: boolean = serviceToTest.isFillRequired();
    serviceToTest.fillWithWater();
    const actualReceivedWaterThirdTime: number = serviceToTest.getWater(givenRequiredWaterInMillilitersForTest);
    // then
    expect(actualReceivedWaterFirstTime).toBe(givenRequiredWaterInMillilitersForTest);
    expect(actualIsRefillNeededAfterSecond).toBe(true);
    expect(actualReceivedWaterThirdTime).toBe(givenRequiredWaterInMillilitersForTest);
  });

});
