import { Injectable } from '@nestjs/common';
import * as machineConfig from './machine-config.json';
import * as coffeeRecipes from './coffee-recipes.json';
import { MachineConfig } from '../model/machine.config';
import { CoffeeRecipe } from '../model/coffee.recipe';

@Injectable()
export class CoffeeMachineConfigurationService {

  public getMachineConfiguration(): MachineConfig {
    return machineConfig;
  }

  public getCoffeeRecipes(): CoffeeRecipe[] {
    return coffeeRecipes;
  }

}