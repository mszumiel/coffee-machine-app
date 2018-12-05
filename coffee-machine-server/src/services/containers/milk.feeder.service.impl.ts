import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { MilkFeederService } from './milk.feeder.service';

@Injectable()
export class MilkFeederServiceImpl implements MilkFeederService {
  private milkFeederEfficiencyInMillilitersPerSecond: number;

  constructor(coffeeMachineConfigurationService: ConfigService) {
    this.milkFeederEfficiencyInMillilitersPerSecond =
      coffeeMachineConfigurationService.get('milkFeederEfficiencyInMillilitersPerSecond') as unknown as number;
  }

  public getMilk(requiredMilkInMilliliters: number): number {
    return requiredMilkInMilliliters;
  }

}