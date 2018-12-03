import { CoffeeOrderStatus } from '../shared/coffee.order.status';

export class CoffeeOrderDto {
  public constructor(
    public id: string,
    public status: CoffeeOrderStatus,
  ) {}
}