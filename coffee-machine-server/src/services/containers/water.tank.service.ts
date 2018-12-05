export interface WaterTankService {
  getWater(requiredWaterInMilliliters: number): number;
  isFillRequired(): boolean;
  fillWithWater();
}