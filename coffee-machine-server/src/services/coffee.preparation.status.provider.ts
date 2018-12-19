export interface CoffeePreparationStatusProvider {
  isPreparationInProgress(): Promise<boolean>;
}