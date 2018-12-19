import {Injectable} from '@nestjs/common';
import {MilkFeederService} from './milk.feeder.service';

@Injectable()
export class MilkFeederServiceImpl implements MilkFeederService {

    public getMilk(requiredMilkInMilliliters: number): Promise<number> {
        return Promise.resolve(requiredMilkInMilliliters);
    }

}