import { Module } from '@nestjs/common';
import { DiagnosticController } from './diagnostic.controller';
import { SharedServicesModule } from '../services/shared.services.module';
import { DiagnosticService } from './diagnostic.service';
import { CoffeeOrderDaoInMemory } from '../dao/coffee.order.dao.in.memory';
import { MachineCleanerService } from '../services/machine.cleaner.service';
import { CoffeePreparationService } from '../services/coffee.preparation.service';
import { ContainersModule } from '../services/containers/containers.module';

@Module({
  imports: [
    SharedServicesModule,
  ],
  controllers: [DiagnosticController],
  providers: [
    DiagnosticService,
  ],
})
export class DiagnosticModule {}
