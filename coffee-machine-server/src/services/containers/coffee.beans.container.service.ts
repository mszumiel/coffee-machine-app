export interface CoffeeBeansContainerService {
  getBeans(requiredBeansInMilligrams: number): Promise<number>;
  isFillRequired(): Promise<boolean>;
  fillWithBeans();
}