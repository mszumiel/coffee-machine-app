import { CoffeeOrderStatus } from './shared/coffee.order.status';

export class CoffeeOrder {
  public constructor(
    public id: number,
    public status: CoffeeOrderStatus,
    public milkInPercentage: number,
    public waterInPercentage: number,
    public coffeeBeansInMilligrams: number,
    public timeOfBrewingInSeconds: number,
  ) {}
}