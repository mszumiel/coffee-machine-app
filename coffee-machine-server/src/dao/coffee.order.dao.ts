import { CoffeeOrder } from '../model/coffee.order';
import { CoffeeRecipe } from '../model/coffee.recipe';
import { CoffeeOrderStatus } from '../model/shared/coffee.order.status';

export interface CoffeeOrderDao {
  save(coffeeRecipe: CoffeeRecipe, status: CoffeeOrderStatus): CoffeeOrder;
  updateStatus(orderToUpdate: CoffeeOrder, statusToUpdate: CoffeeOrderStatus): CoffeeOrder;
  findOne(coffeeOrderId: number): CoffeeOrder;
}