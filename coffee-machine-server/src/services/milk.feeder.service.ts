import { Injectable } from '@nestjs/common';
import { CoffeeMachineConfigurationService } from '../config/coffee.machine.configuration.service';

@Injectable()
export class MilkFeederService {
  private milkFeederEfficiencyInMillilitersPerSecond: number;

  constructor(private readonly coffeeMachineConfigurationService: CoffeeMachineConfigurationService) {
    this.milkFeederEfficiencyInMillilitersPerSecond =
      coffeeMachineConfigurationService.getMachineConfiguration().milkFeederEfficiencyInMillilitersPerSecond;
  }

  public async getMilk(requiredMilkInMilliliters: number): Promise<number> {
    return new Promise(res => {
      setTimeout(res, (requiredMilkInMilliliters / (this.milkFeederEfficiencyInMillilitersPerSecond) * 1000));
      return requiredMilkInMilliliters;
    });
  }

}