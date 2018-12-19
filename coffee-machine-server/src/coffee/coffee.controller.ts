import {Controller, Get, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {CoffeeOrderDto} from '../model/dto/coffee.order.dto';
import {Model} from 'mongoose';
import {CoffeeService} from './coffee.service';
import {CoffeeRecipe} from '../model/coffee.recipe';

@Controller('coffee')
export class CoffeeController {

    constructor(private readonly coffeeService: CoffeeService) {
    }

    @Post(':id/order')
    requestCoffee(@Param('id') recipeId: number, @Res() res) {
        const orderedCoffee = this.coffeeService.requestCoffee(recipeId);
        if (orderedCoffee == null || orderedCoffee === undefined) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
        res.status(HttpStatus.CREATED).send();
    }

    @Get(':id/status')
    getStatus(@Param('id') id: number): Promise<CoffeeOrderDto> {
        return this.coffeeService.getStatus(id);
    }

    @Get('recipes')
    getRecipes(): Promise<CoffeeRecipe[]> {
        return this.coffeeService.getRecipes();
    }

}
