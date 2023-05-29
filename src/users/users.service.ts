import { Injectable } from '@nestjs/common';

import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

import type { UserEntity } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findOne(email: UserEntity['email']): Promise<UserEntity | undefined> {
    return await this.knex
      .select()
      .from('users')
      .where({ email: email })
      .first();
  }
}
