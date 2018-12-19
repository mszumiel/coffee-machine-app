import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config/config.service';
import {WaterTankService} from './water.tank.service';

@Injectable()
export class WaterTankServiceImpl implements WaterTankService {

    private readonly capacityInMilliliters: number;
    private currentLevelInMilliliters: number;
    private waterFillRequired = false;

    constructor(coffeeMachineConfigurationService: ConfigService) {
        this.capacityInMilliliters = coffeeMachineConfigurationService.get('waterTankCapacityInMilliliters') as unknown as number;
        this.currentLevelInMilliliters = this.capacityInMilliliters;
    }

    public getWater(requiredWaterInMilliliters: number): Promise<number> {
        if (requiredWaterInMilliliters > this.capacityInMilliliters) {
            this.waterFillRequired = true;
            return Promise.resolve(0);
        }
        if ((this.currentLevelInMilliliters - requiredWaterInMilliliters) < 0) {
            this.waterFillRequired = true;
            return Promise.resolve(0);
        }
        this.currentLevelInMilliliters -= requiredWaterInMilliliters;
        if (this.currentLevelInMilliliters === 0) {
            this.waterFillRequired = true;
        }

        return Promise.resolve(requiredWaterInMilliliters);
    }

    public isFillRequired(): Promise<boolean> {
        return Promise.resolve(this.waterFillRequired);
    }

    public fillWithWater() {
        this.currentLevelInMilliliters = this.capacityInMilliliters;
        this.waterFillRequired = false;
    }

}