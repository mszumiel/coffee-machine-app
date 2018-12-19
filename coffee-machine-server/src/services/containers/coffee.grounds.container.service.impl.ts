import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';
import {CoffeeGroundsContainerService} from './coffee.grounds.container.service';

@Injectable()
export class CoffeeGroundsContainerServiceImpl implements CoffeeGroundsContainerService {

    private readonly capacityInMilligrams: number;
    private currentLevelOfGroundsInMilligrams: number;
    private emptiedRequired = false;

    constructor(coffeeMachineConfigurationService: ConfigService) {
        this.capacityInMilligrams = coffeeMachineConfigurationService.get('coffeeGroundsContainerCapacityInMilligrams') as unknown as number;
        this.currentLevelOfGroundsInMilligrams = 0;
    }

    public fillWithGrounds(groundsInMilligrams: number): Promise<boolean> {
        if ((this.currentLevelOfGroundsInMilligrams + groundsInMilligrams) > this.capacityInMilligrams) {
            this.emptiedRequired = true;
            return Promise.resolve(false);
        }
        this.currentLevelOfGroundsInMilligrams += groundsInMilligrams;
        if (this.currentLevelOfGroundsInMilligrams as number == this.capacityInMilligrams as number) {
            this.emptiedRequired = true;
        }
        return Promise.resolve(true);
    }

    public isEmptiedRequired(): Promise<boolean> {
        return Promise.resolve(this.emptiedRequired);
    }

    public emptyTheContainer() {
        this.currentLevelOfGroundsInMilligrams = 0;
        this.emptiedRequired = false;
    }

}