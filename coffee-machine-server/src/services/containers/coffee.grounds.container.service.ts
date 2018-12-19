export interface CoffeeGroundsContainerService {
  fillWithGrounds(groundsInMilligrams: number): Promise<boolean>;
  isEmptiedRequired(): Promise<boolean>;
  emptyTheContainer();
}