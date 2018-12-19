import {Inject, Injectable} from '@nestjs/common';
import {CoffeeOrderDao} from '../dao/coffee.order.dao';
import {CoffeeOrderStatus} from '../model/shared/coffee.order.status';
import {ConfigService} from '../config/config.service';
import {CoffeeRecipe} from '../model/coffee.recipe';
import {CoffeePreparationService} from '../services/coffee.preparation.service';
import {CoffeeOrderDto} from '../model/dto/coffee.order.dto';
import {Logger} from 'winston';
import {CoffeeOrder} from '../model/coffee.order';
import {CleanerStatusProvider} from '../diagnostic/cleaner.status.provider';

@Injectable()
export class CoffeeService {

    readonly coffeeRecipes: CoffeeRecipe[];

    public constructor(
        @Inject('winston') private readonly logger: Logger,
        @Inject('MachineCleanerService') private readonly cleanerStatusProvider: CleanerStatusProvider,
        @Inject('CoffeeOrderDaoInMemory') private readonly coffeeOrderDao: CoffeeOrderDao,
        private readonly coffeePreparationService: CoffeePreparationService,
    ) {
        this.coffeeRecipes = ConfigService.getCoffeeRecipes();
    }

    requestCoffee(recipeId: number): Promise<CoffeeOrder> {
        this.logger.info('request coffee for recipe with id ' + recipeId);
        if (this.cleanerStatusProvider.isWorking()) {
            this.logger.error('coffee machine cleaning in progress, cannot prepare coffee');
            return Promise.resolve(null);
        }
        const coffeeRecipeToRequest = this.coffeeRecipes.filter(recipe => recipe.id == recipeId)[0];
        if (coffeeRecipeToRequest == null || coffeeRecipeToRequest === undefined) {
            this.logger.error('no coffee recipe for id ' + recipeId);
            return Promise.resolve(null);
        }

        this.logger.debug('request coffee with recipe ' + JSON.stringify(coffeeRecipeToRequest));
        return this.coffeeOrderDao.save(coffeeRecipeToRequest, CoffeeOrderStatus.IN_PROGRESS)
            .then(orderedCoffee => {
                if (orderedCoffee == null || orderedCoffee === undefined) {
                    this.logger.error('error occurred while saving coffee order ' + JSON.stringify(coffeeRecipeToRequest));
                    return null;
                }
                this.logger.info('prepare coffee with recipe ' + JSON.stringify(orderedCoffee));
                this.coffeePreparationService.prepareCoffee(orderedCoffee.id);
                return orderedCoffee;
            });
    }

    getStatus(id: number): Promise<CoffeeOrderDto> {
        return this.coffeeOrderDao.findOne(id)
            .then(coffeeOrder => {
                if (coffeeOrder == null || coffeeOrder === undefined) {
                    return new CoffeeOrderDto(id as number, CoffeeOrderStatus[CoffeeOrderStatus.NOT_ORDERED]);
                }
                return new CoffeeOrderDto(
                    coffeeOrder.id,
                    CoffeeOrderStatus[coffeeOrder.status],
                );
            });
    }

    getRecipes(): Promise<CoffeeRecipe[]> {
        return Promise.resolve(this.coffeeRecipes);
    }

}