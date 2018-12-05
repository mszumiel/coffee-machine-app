import { Injectable } from "@nestjs/common";
import { CoffeeRecipe } from "../model/coffee.recipe";
import { CoffeeOrder } from "../model/coffee.order";
import { CoffeeOrderStatus } from "../model/shared/coffee.order.status";
import { Model } from "mongoose";
import { CoffeeOrderDao } from "./coffee.order.dao";

@Injectable()
export class CoffeeOrderDaoInMemory implements CoffeeOrderDao {

  savedCoffeeOrders: { [key: number]: CoffeeOrder; } = {};

  save(coffeeRecipe: CoffeeRecipe, status: CoffeeOrderStatus): CoffeeOrder {
    this.savedCoffeeOrders[coffeeRecipe.id] = new CoffeeOrder(
      coffeeRecipe.id,
      status,
      coffeeRecipe.milkInPercentage,
      coffeeRecipe.waterInPercentage,
      coffeeRecipe.coffeeBeansInMilligrams,
      coffeeRecipe.timeOfBrewingInSeconds,
    );
    return this.savedCoffeeOrders[coffeeRecipe.id];
  }

  updateStatus(orderToUpdate: CoffeeOrder, statusToUpdate: CoffeeOrderStatus): CoffeeOrder {
    this.savedCoffeeOrders[orderToUpdate.id].status = statusToUpdate;
    return this.savedCoffeeOrders[orderToUpdate.id];
  }

  findOne(coffeeOrderId: number): CoffeeOrder {
    return this.savedCoffeeOrders[coffeeOrderId];
  }

}