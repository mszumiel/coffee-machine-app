import { Controller, Get, Post } from '@nestjs/common';
import { CoffeeOrderStatus } from '../model/shared/coffee.order.status';
import { CoffeeOrderDto } from '../model/dto/coffee.order.dto';
import { Model } from 'mongoose';
import { CoffeeRecipe } from '../model/coffee.recipe';
import { CoffeeService } from './coffee.service';

@Controller('coffee')
export class CoffeeController {

  constructor(private readonly coffeeService: CoffeeService) {}

  @Post('order')
  async requestCoffee(): Promise<CoffeeRecipe> {
    return this.coffeeService.requestCoffee();
  }

  @Get('status')
  async getStatus(): Promise<CoffeeOrderDto> {
    return new CoffeeOrderDto(CoffeeOrderStatus.DONE);
  }

  @Get()
  async findAll(): Promise<CoffeeRecipe[]> {
    return this.coffeeService.findAll();
  }

}
