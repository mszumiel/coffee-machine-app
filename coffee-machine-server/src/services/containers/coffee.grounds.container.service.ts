export interface CoffeeGroundsContainerService {
  fillWithGrounds(groundsInMilligrams: number): boolean;
  isEmptiedRequired(): boolean;
  emptyTheContainer();
}