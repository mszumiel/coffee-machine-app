import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeOrderSchema } from './schemas/coffee.order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeOrderService } from '../services/coffee.order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CoffeeOrder', schema: CoffeeOrderSchema }]),
  ],
  controllers: [CoffeeController],
  providers: [CoffeeOrderService],
})
export class CoffeeModule {}
