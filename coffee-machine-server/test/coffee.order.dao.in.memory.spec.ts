import { CoffeeOrderDaoInMemory } from '../src/dao/coffee.order.dao.in.memory';
import { CoffeeRecipe } from '../src/model/coffee.recipe';
import { CoffeeOrderStatus } from '../src/model/shared/coffee.order.status';
import { CoffeeOrder } from '../src/model/coffee.order';

describe('CoffeeOrderDaoInMemory Service', () => {
  const serviceToTest = new CoffeeOrderDaoInMemory();

  it('should save new coffee order', () => {
    // given
    const givenCoffeeRecipe: CoffeeRecipe = {
      id: 1,
      name: 'Latte',
      milkInPercentage: 40,
      waterInPercentage: 60,
      coffeeBeansInMilligrams: 10,
      timeOfBrewingInSeconds: 5
    };
    const givenStatus = CoffeeOrderStatus.IN_PROGRESS;
    // when
    const actualSavedCoffeeOrder: CoffeeOrder = serviceToTest.save(givenCoffeeRecipe, givenStatus);
    // then
    expect(actualSavedCoffeeOrder.id).toBe(1);
  });

  it('should update saved coffee order status', () => {
    // given
    const givenCoffeeRecipe: CoffeeRecipe = {
      id: 1,
      name: 'Latte',
      milkInPercentage: 40,
      waterInPercentage: 60,
      coffeeBeansInMilligrams: 10,
      timeOfBrewingInSeconds: 5,
    };
    const givenStatus = CoffeeOrderStatus.IN_PROGRESS;
    const givenUpdatedStatus = CoffeeOrderStatus.DONE;
    // when
    const actualSavedCoffeeOrder: CoffeeOrder = serviceToTest.save(givenCoffeeRecipe, givenStatus);
    serviceToTest.findOne(givenCoffeeRecipe.id);
    const actualCoffeeOrderAfterUpdate = serviceToTest.updateStatus(actualSavedCoffeeOrder, givenUpdatedStatus);
    // then
    expect(actualSavedCoffeeOrder.id).toBe(givenCoffeeRecipe.id);
    expect(actualCoffeeOrderAfterUpdate.status).toBe(givenUpdatedStatus);
  });

});
