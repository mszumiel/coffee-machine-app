import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeController } from './coffee.controller';

describe('CoffeeRecipe Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CoffeeController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CoffeeController = module.get<CoffeeController>(CoffeeController);
    expect(controller).toBeDefined();
  });
});
