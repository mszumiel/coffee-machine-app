export interface PreparedCoffeesCountProvider {
  getNumberOfPreparedCoffees(): Promise<number>;
}