import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { CoffeeGroundsContainerServiceImpl } from '../src/services/containers/coffee.grounds.container.service.impl';

describe('CoffeeGroundsContainerServiceImpl Service', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [CoffeeGroundsContainerServiceImpl],
        }).compile();
    });

    it('should be defined', () => {
        const serviceToTest: CoffeeGroundsContainerServiceImpl = module.get<CoffeeGroundsContainerServiceImpl>(CoffeeGroundsContainerServiceImpl);
        expect(serviceToTest).toBeDefined();
    });

    it('should fill coffee grounds and return that it filled successfully', () => {
        // given
        const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
        const givenCoffeeGroundsToFillWithInMilligrams = (appConfig.get('coffeeGroundsContainerCapacityInMilligrams') as unknown as number) - 10;
        const serviceToTest: CoffeeGroundsContainerServiceImpl = module.get<CoffeeGroundsContainerServiceImpl>(CoffeeGroundsContainerServiceImpl);
        serviceToTest.emptyTheContainer();
        // when
        return serviceToTest.fillWithGrounds(givenCoffeeGroundsToFillWithInMilligrams)
          .then((actualFilledWithGrounds: boolean ) => {
            // then
            expect(actualFilledWithGrounds).toBe(true);
            serviceToTest.isEmptiedRequired()
              .then((isEmptiedRequired: boolean) => {
                expect(isEmptiedRequired).toBe(false);
              });
          });
    });

    it('should fill coffee grounds and return that it did not fill successfully', () => {
        // given
        const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
        const givenCoffeeGroundsToFillWithInMilligrams = (appConfig.get('coffeeGroundsContainerCapacityInMilligrams') as unknown as number) * 2;
        const serviceToTest: CoffeeGroundsContainerServiceImpl = module.get<CoffeeGroundsContainerServiceImpl>(CoffeeGroundsContainerServiceImpl);
        serviceToTest.emptyTheContainer();
        // when
        return serviceToTest.fillWithGrounds(givenCoffeeGroundsToFillWithInMilligrams)
          .then((actualFilledWithGrounds: boolean) => {
            // then
            expect(actualFilledWithGrounds).toBe(false);
            serviceToTest.isEmptiedRequired()
              .then((isEmptiedRequired: boolean) => {
                expect(isEmptiedRequired).toBe(true);
              });
          });
    });

    it('should fill coffee grounds with summarize size equal to container capacity and return that it filled successfully and required to be emptied', () => {
        // given
        const appConfig: ConfigService = module.get<ConfigService>(ConfigService);
        const givenCoffeeGroundsToFillWithInMilligrams = (appConfig.get('coffeeGroundsContainerCapacityInMilligrams') as unknown as number) / 2;
        const serviceToTest: CoffeeGroundsContainerServiceImpl = module.get<CoffeeGroundsContainerServiceImpl>(CoffeeGroundsContainerServiceImpl);
        serviceToTest.emptyTheContainer();
        // when
        return serviceToTest.fillWithGrounds(givenCoffeeGroundsToFillWithInMilligrams)
          .then((actualFilledWithGroundsFirstTime: boolean) => {
            serviceToTest.fillWithGrounds(givenCoffeeGroundsToFillWithInMilligrams)
              .then((actualFilledWithGroundsSecondTime: boolean) => {
                // then
                expect(actualFilledWithGroundsFirstTime).toBe(true);
                expect(actualFilledWithGroundsSecondTime).toBe(true);
                serviceToTest.isEmptiedRequired()
                  .then((isEmptiedRequired: boolean) => {
                    expect(isEmptiedRequired).toBe(true);
                  });
              });
          });
    });

});
