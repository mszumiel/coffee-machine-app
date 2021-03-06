import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';
import {CoffeeBeansContainerService} from './coffee.beans.container.service';

@Injectable()
export class CoffeeBeansContainerServiceImpl implements CoffeeBeansContainerService {

    private readonly capacityInMilligrams: number;
    private currentLevelInMilligrams: number;
    private beansFillRequired = false;

    constructor(coffeeMachineConfigurationService: ConfigService) {
        this.capacityInMilligrams = coffeeMachineConfigurationService.get('coffeeBeansContainerCapacityInMilligrams') as unknown as number;
        this.currentLevelInMilligrams = this.capacityInMilligrams;
    }

    public getBeans(requiredBeansInMilligrams: number): Promise<number> {
        if (requiredBeansInMilligrams > this.capacityInMilligrams) {
            this.beansFillRequired = true;
            return Promise.resolve(0);
        }
        if ((this.currentLevelInMilligrams - requiredBeansInMilligrams) < 0) {
            this.beansFillRequired = true;
            return Promise.resolve(0);
        }
        this.currentLevelInMilligrams -= requiredBeansInMilligrams;
        if (this.currentLevelInMilligrams === 0) {
            this.beansFillRequired = true;
        }

        return Promise.resolve(requiredBeansInMilligrams);
    }

    public isFillRequired(): Promise<boolean> {
        return Promise.resolve(this.beansFillRequired);
    }

    public fillWithBeans() {
        this.currentLevelInMilligrams = this.capacityInMilligrams;
        this.beansFillRequired = false;
    }

}