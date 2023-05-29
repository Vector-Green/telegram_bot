import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';

import { FastifyReply } from 'fastify';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<FastifyReply>();

    return res.sendFile('index.html');
  }
}
