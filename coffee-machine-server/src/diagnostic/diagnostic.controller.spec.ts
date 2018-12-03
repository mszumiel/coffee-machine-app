import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticController } from './diagnostic.controller';

describe('Diagnostic Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DiagnosticController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: DiagnosticController = module.get<DiagnosticController>(DiagnosticController);
    expect(controller).toBeDefined();
  });
});
