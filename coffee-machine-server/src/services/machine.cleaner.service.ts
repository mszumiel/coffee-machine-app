import { Inject, Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { PreparedCoffeesCountProvider } from './prepared.coffees.count.provider';
import { ConfigService } from '../config/config.service';
import { CoffeePreparationStatusProvider } from './coffee.preparation.status.provider';
import { CleanerStatusProvider } from '../diagnostic/cleaner.status.provider';
import { Logger } from 'winston';

@Injectable()
export class MachineCleanerService extends NestSchedule implements CleanerStatusProvider {

  readonly numberOfCoffeesRequiringCleaning: number;
  numberOfExecutedCleanings = 0;
  cleaningInProgress = false;

  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject('PreparedCoffeesCountProvider') private readonly preparedCoffeesCountProvider: PreparedCoffeesCountProvider,
    @Inject('CoffeePreparationStatusProvider') private readonly coffeePreparationStatusProvider: CoffeePreparationStatusProvider,
    private readonly appConfig: ConfigService
  ) {
    super();
    this.numberOfCoffeesRequiringCleaning = appConfig.get('numberOfPreparedCoffeesRequiringCleaning') as unknown as number;
  }

  @Interval(10000)
  checkMachineForCleaning() {
    if (this.cleaningInProgress === true || this.coffeePreparationStatusProvider.isPreparationInProgress()) {
      return;
    }
    this.preparedCoffeesCountProvider.getNumberOfPreparedCoffees()
      .then(numberOfPreparedCoffees => {
        this.logger.debug(`Number of prepared coffees ${numberOfPreparedCoffees}`);
        if (numberOfPreparedCoffees >= (this.numberOfExecutedCleanings + 1) * this.numberOfCoffeesRequiringCleaning) {
          this.cleaningInProgress = true;
          setTimeout(() => {
            this.numberOfExecutedCleanings++;
            this.cleaningInProgress = false;
          }, 5000);
        }
      });
  }

  isWorking(): Promise<boolean> {
    return Promise.resolve(this.cleaningInProgress);
  }

}