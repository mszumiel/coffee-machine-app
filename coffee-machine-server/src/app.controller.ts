import { Get, Controller } from '@nestjs/common';
import { CoffeeOrderService } from './services/coffee.order.service';

@Controller()
export class AppController {
  constructor(private readonly appService: CoffeeOrderService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }
}
