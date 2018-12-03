import { Controller, Get } from '@nestjs/common';
import { MachineStatusDto } from '../model/dto/machine.status.dto';

@Controller('diagnostic')
export class DiagnosticController {

  @Get('status')
  getStatus() {
    return new MachineStatusDto(false);
  }

}
