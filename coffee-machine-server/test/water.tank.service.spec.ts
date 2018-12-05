import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeBeansContainerServiceImpl } from '../src/services/containers/coffee.beans.container.service.impl';
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
    const requiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) - 10;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const receivedWaterInMilliliters = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    // then
    expect(receivedWaterInMilliliters).toBe(requiredWaterInMillilitersForTest);
    expect(serviceToTest.isFillRequired()).toBe(false);
  });

  it('should get water with size greater then capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) + 10;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const receivedWaterInMilliliters = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    // then
    expect(receivedWaterInMilliliters).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with summarized size equal to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const receivedWaterFirstTime = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    const receivedWaterSecondTime = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    // then
    expect(receivedWaterFirstTime).toBe(requiredWaterInMillilitersForTest);
    expect(receivedWaterSecondTime).toBe(requiredWaterInMillilitersForTest);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with summarized size greater to capacity from tank and return that it needs refill', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredWaterInMillilitersForTest = (appConfig.get('waterTankCapacityInMilliliters') as unknown as number) / 2;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const receivedWaterFirstTime = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    const receivedWaterSecondTime = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    const receivedWaterThirdTime = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    // then
    expect(receivedWaterFirstTime).toBe(requiredWaterInMillilitersForTest);
    expect(receivedWaterSecondTime).toBe(requiredWaterInMillilitersForTest);
    expect(receivedWaterThirdTime).toBe(0);
    expect(serviceToTest.isFillRequired()).toBe(true);
  });

  it('should get water with size greater then capacity from tank and after refill should return water', () => {
    // given
    const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
    const requiredWaterInMillilitersForTest: number = appConfig.get('waterTankCapacityInMilliliters') as unknown as number;
    const serviceToTest: WaterTankServiceImpl = module.get<WaterTankServiceImpl>(WaterTankServiceImpl);
    serviceToTest.fillWithWater();
    // when
    const receivedWaterFirstTime: number = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    serviceToTest.getWater(requiredWaterInMillilitersForTest);
    const isRefillNeededAfterSecond: boolean = serviceToTest.isFillRequired();
    serviceToTest.fillWithWater();
    const receivedWaterThirdTime: number = serviceToTest.getWater(requiredWaterInMillilitersForTest);
    // then
    expect(receivedWaterFirstTime).toBe(requiredWaterInMillilitersForTest);
    expect(isRefillNeededAfterSecond).toBe(true);
    expect(receivedWaterThirdTime).toBe(requiredWaterInMillilitersForTest);
  });

});
