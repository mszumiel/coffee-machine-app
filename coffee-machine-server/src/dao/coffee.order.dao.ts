import { CoffeeOrder } from '../model/coffee.order';
import { CoffeeRecipe } from '../model/coffee.recipe';
import { CoffeeOrderStatus } from '../model/shared/coffee.order.status';

export interface CoffeeOrderDao {
  save(coffeeRecipe: CoffeeRecipe, status: CoffeeOrderStatus): Promise<CoffeeOrder>;
  updateStatus(orderToUpdate: CoffeeOrder, statusToUpdate: CoffeeOrderStatus): Promise<CoffeeOrder>;
  findOne(coffeeOrderId: number): Promise<CoffeeOrder>;
}