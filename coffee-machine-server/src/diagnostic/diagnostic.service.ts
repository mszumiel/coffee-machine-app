import { Inject, Injectable } from '@nestjs/common';
import { CleanerStatusProvider } from './cleaner.status.provider';
import { MachineStatusDto } from '../model/dto/machine.status.dto';
import { CoffeePreparationStatusProvider } from '../services/coffee.preparation.status.provider';
import { CoffeeBeansContainerService } from '../services/containers/coffee.beans.container.service';
import { CoffeeGroundsContainerService } from 'src/services/containers/coffee.grounds.container.service';
import { WaterTankService } from '../services/containers/water.tank.service';

@Injectable()
export class DiagnosticService {
    public constructor(
      @Inject('MachineCleanerService') private readonly cleanerStatusProvider: CleanerStatusProvider,
      @Inject('CoffeePreparationService') private readonly coffeePreparationStatusProvider: CoffeePreparationStatusProvider,
      @Inject('CoffeeBeansContainerServiceImpl') private readonly coffeeBeansContainerService: CoffeeBeansContainerService,
      @Inject('CoffeeGroundsContainerServiceImpl') private readonly coffeeGroundsContainerService: CoffeeGroundsContainerService,
      @Inject('WaterTankServiceImpl') private readonly waterTankService: WaterTankService,
    ) {}

  getMachineStatus(): MachineStatusDto {
    return new MachineStatusDto(
      this.coffeePreparationStatusProvider.isPreparationInProgress(),
      this.cleanerStatusProvider.isWorking(),
      this.waterTankService.isFillRequired(),
      this.coffeeBeansContainerService.isFillRequired(),
      this.coffeeGroundsContainerService.isEmptiedRequired()
    );
  }
}