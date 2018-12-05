import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { CoffeeGroundsContainerService } from './coffee.grounds.container.service';

@Injectable()
export class CoffeeGroundsContainerServiceImpl implements CoffeeGroundsContainerService {

  private readonly capacityInMilligrams: number;
  private currentLevelOfGroundsInMilligrams: number;
  private emptiedRequired = false;

  constructor(coffeeMachineConfigurationService: ConfigService) {
    this.capacityInMilligrams = coffeeMachineConfigurationService.get('coffeeGroundsContainerCapacityInMilligrams') as unknown as number;
    this.currentLevelOfGroundsInMilligrams = 0;
  }

  public fillWithGrounds(groundsInMilligrams: number): boolean {
    if ((this.currentLevelOfGroundsInMilligrams + groundsInMilligrams) > this.capacityInMilligrams) {
      this.emptiedRequired = true;
      return false;
    }
    this.currentLevelOfGroundsInMilligrams += groundsInMilligrams;
    if (this.currentLevelOfGroundsInMilligrams as number == this.capacityInMilligrams as number) {
      this.emptiedRequired = true;
    }
    return true;
  }

  public isEmptiedRequired(): boolean {
    return this.emptiedRequired;
  }

  public emptyTheContainer() {
    this.currentLevelOfGroundsInMilligrams = 0;
    this.emptiedRequired = false;
  }

}