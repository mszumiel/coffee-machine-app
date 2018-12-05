export interface MilkFeederService {
  getMilk(requiredMilkInMilliliters: number): number;
}