export interface WaterTankService {
  getWater(requiredWaterInMilliliters: number): Promise<number>;
  isFillRequired(): Promise<boolean>;
  fillWithWater();
}