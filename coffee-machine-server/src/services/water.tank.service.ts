import { Injectable } from '@nestjs/common';
import { CoffeeMachineConfigurationService } from '../config/coffee.machine.configuration.service';

@Injectable()
export class WaterTankService {

  private readonly capacityInMilliliters: number;
  private readonly waterFeedEfficiencyInMillilitersPerSecond: number;
  private currentLevelInMilliliters: number;
  private waterFillRequired = false;

  constructor(private readonly coffeeMachineConfigurationService: CoffeeMachineConfigurationService) {
    this.capacityInMilliliters = coffeeMachineConfigurationService.getMachineConfiguration().waterTankCapacityInMilliliters;
    this.waterFeedEfficiencyInMillilitersPerSecond =
      coffeeMachineConfigurationService.getMachineConfiguration().waterTankFeedEfficiencyInMillilitersPerSecond;
    this.currentLevelInMilliliters = this.capacityInMilliliters;
  }

  public async getWater(requiredWaterInMilliliters: number): Promise<number> {
    if (requiredWaterInMilliliters > this.capacityInMilliliters) {
      return 0;
    }
    if ((this.currentLevelInMilliliters - requiredWaterInMilliliters) < 0) {
      this.waterFillRequired = true;
      return 0;
    }
    this.currentLevelInMilliliters -= requiredWaterInMilliliters;
    return new Promise(res => {
      setTimeout(res, (requiredWaterInMilliliters / (this.waterFeedEfficiencyInMillilitersPerSecond) * 1000));
      return requiredWaterInMilliliters;
    });
  }

  public isFillRequired(): boolean {
    return this.waterFillRequired;
  }

  public fillWithWater() {
    this.currentLevelInMilliliters = this.capacityInMilliliters;
    this.waterFillRequired = false;
  }

}