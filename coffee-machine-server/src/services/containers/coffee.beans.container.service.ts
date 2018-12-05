export interface CoffeeBeansContainerService {
  getBeans(requiredBeansInMilligrams: number): number;
  isFillRequired(): boolean;
  fillWithBeans();
}