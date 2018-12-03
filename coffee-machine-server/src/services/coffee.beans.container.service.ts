import { Injectable } from '@nestjs/common';
import { CoffeeMachineConfigurationService } from '../config/coffee.machine.configuration.service';
import { timeout } from 'rxjs/operators';

@Injectable()
export class CoffeeBeansContainerService {

  private readonly capacityInMilligrams: number;
  private readonly beansFeedEfficiencyInMillilitersPerSecond: number;
  private currentLevelInMilligrams: number;
  private beansFillRequired = false;

  constructor(private readonly coffeeMachineConfigurationService: CoffeeMachineConfigurationService) {
    this.capacityInMilligrams = coffeeMachineConfigurationService.getMachineConfiguration().coffeeBeansContainerCapacityInMilligrams;
    this.beansFeedEfficiencyInMillilitersPerSecond =
      coffeeMachineConfigurationService.getMachineConfiguration().coffeeBeansFeedEfficiencyInMillilitersPerSecond;
    this.currentLevelInMilligrams = this.capacityInMilligrams;
  }

  public async getBeans(requiredBeansInMilligrams: number): Promise<number> {
    if (requiredBeansInMilligrams > this.capacityInMilligrams) {
      return 0;
    }
    if ((this.currentLevelInMilligrams - requiredBeansInMilligrams) < 0) {
      this.beansFillRequired = true;
      return 0;
    }
    this.currentLevelInMilligrams -= requiredBeansInMilligrams;
    return new Promise(res => {
      setTimeout(res, (requiredBeansInMilligrams / (this.beansFeedEfficiencyInMillilitersPerSecond) * 1000));
      return requiredBeansInMilligrams;
      });
  }

  public isFillRequired(): boolean {
    return this.beansFillRequired;
  }

  public fillWithBeans() {
    this.currentLevelInMilligrams = this.capacityInMilligrams;
    this.beansFillRequired = false;
  }

}