import { Controller, Get } from '@nestjs/common';
import { MachineStatusDto } from '../model/dto/machine.status.dto';
import { DiagnosticService } from './diagnostic.service';

@Controller('diagnostic')
export class DiagnosticController {

  public constructor(
    private readonly diagnosticService: DiagnosticService,
  ) {}

  @Get('status')
  getStatus(): Promise<MachineStatusDto> {
    return this.diagnosticService.getMachineStatus();
  }

}
