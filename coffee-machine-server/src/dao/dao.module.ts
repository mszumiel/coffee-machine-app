import { Module } from '@nestjs/common';
import { CoffeeOrderDaoInMemory } from './coffee.order.dao.in.memory';

@Module({
  providers: [
    CoffeeOrderDaoInMemory,
  ],
  exports: [
    CoffeeOrderDaoInMemory,
  ],
})
export class DaoModule {}
