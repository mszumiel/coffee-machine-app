import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import * as mongoUnit from 'mongo-unit';

@Injectable()
export class DbConfigService implements MongooseOptionsFactory {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const dbUrl = await mongoUnit.start();
    return {
      uri: dbUrl,
    };
  }
}