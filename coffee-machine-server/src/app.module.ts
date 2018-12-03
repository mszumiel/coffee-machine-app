import { Module } from '@nestjs/common';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { CoffeeModule } from './coffee/coffee.module';
import { CleanerModule } from './cleaner/cleaner.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfigService } from './db.config.service';
import { CoffeeOrderSchema } from './coffee/schemas/coffee.order.schema';

@Module({
  imports: [
    DiagnosticModule,
    CoffeeModule,
    CleanerModule,
    MongooseModule.forRootAsync({
      useClass: DbConfigService,
    }),
  ],
})
export class AppModule {

}
