import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoffeeOrder } from '../model/coffee.order';
import { CoffeeBeansContainerService } from './coffee.beans.container.service';
import { CoffeeGroundsContainerService } from './coffee.grounds.container.service';
import { MilkFeederService } from './milk.feeder.service';
import { WaterTankService } from './water.tank.service';

@Injectable()
export class CoffeePreparationService {

  constructor(
    @InjectModel('CoffeeOrder') private readonly coffeeModel: Model<CoffeeOrder>,
    private readonly coffeeBeansContainerService: CoffeeBeansContainerService,
    private readonly coffeeGroundsContainerService: CoffeeGroundsContainerService,
    private readonly milkFeederService: MilkFeederService,
    private readonly waterTankService: WaterTankService,
  ) {}

  async prepareCoffee(coffeeOrderId: string) {
    const coffeeOrderToPrepare: CoffeeOrder = await this.coffeeModel.findById(coffeeOrderId).exec();
    // TODO implementation of whole process
  }

}
