export interface MilkFeederService {
  getMilk(requiredMilkInMilliliters: number): Promise<number>;
}