import { Injectable } from '@nestjs/common';
import { CoffeeMachineConfigurationService } from '../config/coffee.machine.configuration.service';

@Injectable()
export class CoffeeGroundsContainerService {

  private readonly capacityInMilligrams: number;
  private currentLevelOfGroundsInMilligrams: number;
  private emptiedRequired = false;

  constructor(private readonly coffeeMachineConfigurationService: CoffeeMachineConfigurationService) {
    this.capacityInMilligrams = coffeeMachineConfigurationService.getMachineConfiguration().coffeeGroundsContainerCapacityInMilligrams;
    this.currentLevelOfGroundsInMilligrams = 0;
  }

  public fillWithGrounds(groundsInMilligrams: number): boolean {
    if ((this.currentLevelOfGroundsInMilligrams + groundsInMilligrams) >= this.capacityInMilligrams) {
      this.emptiedRequired = true;
      return false;
    }
    this.currentLevelOfGroundsInMilligrams += groundsInMilligrams;
    return true;
  }

  public getCurrentGroundsLevel(): number {
    return this.currentLevelOfGroundsInMilligrams;
  }

  public isEmptiedRequired(): boolean {
    return this.emptiedRequired;
  }

  public emptyTheContainer() {
    this.currentLevelOfGroundsInMilligrams = 0;
    this.emptiedRequired = false;
  }

}