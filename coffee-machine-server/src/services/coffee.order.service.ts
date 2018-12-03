import { Injectable } from '@nestjs/common';
import { CoffeeRecipe } from '../model/coffee.recipe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoffeeOrder } from '../model/coffee.order';
import { CoffeeOrderStatus } from '../model/shared/coffee.order.status';
import { CoffeePreparationService } from './coffee.preparation.service';

@Injectable()
export class CoffeeOrderService {

  constructor(
    @InjectModel('CoffeeOrder') private readonly coffeeModel: Model<CoffeeOrder>,
    private readonly coffeePreparationService: CoffeePreparationService,
  ) {}

  orderCoffee(coffeeRecipe: CoffeeRecipe) {
    const createdCoffeeOrder = new this.coffeeModel(new CoffeeOrder(
      null,
      coffeeRecipe.id,
      CoffeeOrderStatus.IN_PROGRESS,
      coffeeRecipe.milkInPercentage,
      coffeeRecipe.waterInPercentage,
      coffeeRecipe.coffeeBeansInMilligrams,
      coffeeRecipe.timeOfBrewingInSeconds,
    ));
    createdCoffeeOrder.save()
      .then((savedCoffeeOrder: CoffeeOrder) => {
        this.coffeePreparationService.prepareCoffee(savedCoffeeOrder._id);
      }).catch(error => {
        console.error(error);
    });
  }

  async findAll(): Promise<CoffeeOrder[]> {
    return await this.coffeeModel.find().exec();
  }

}
