export interface CleanerStatusProvider {
  isWorking(): Promise<boolean>;
}