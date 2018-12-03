export class MachineStatusDto {
  public constructor(
    public coffeePreparationInProgress: boolean,
    public cleaningInProgress: boolean,
    public waterTankEmpty: boolean,
    public coffeeBeansContainerEmpty: boolean,
    public coffeeGroundsContainerFull: boolean,
  ) {}
}