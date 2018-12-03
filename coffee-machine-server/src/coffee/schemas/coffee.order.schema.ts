import * as mongoose from 'mongoose';
import { CoffeeOrderStatus } from '../../model/shared/coffee.order.status';

export const CoffeeOrderSchema = new mongoose.Schema({
  id: Number,
  status: CoffeeOrderStatus,
  milkInPercentage: Number,
  waterInPercentage: Number,
  coffeeBeansInMilligrams: Number,
  timeOfBrewingInSeconds: Number,
});