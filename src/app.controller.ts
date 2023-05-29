import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';

import { UserEntity } from './users/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get('usersService')
  async findUserByEmail(): Promise<UserEntity | undefined> {
    //TODO: use validation
    return await this.usersService.findOne('example@example.com');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
