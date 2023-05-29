import path from 'path';

import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection, KnexModule } from 'nest-knexjs';
import { Knex } from 'knex';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import knexConfig from '../knexfile';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.secret`],
    }),
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: knexConfig[APP_NODE_ENV],
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async onModuleInit() {
    await this.knex.migrate
      .latest(knexConfig[APP_NODE_ENV].migrations)
      .then(() => {
        console.log('Successfully migrated');
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
