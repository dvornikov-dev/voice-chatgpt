import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import type { Update } from 'telegraf/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import { SecretTokenGuard } from './token.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @UseGuards(SecretTokenGuard)
  @Post('webhook')
  async webhook(@Req() req: FastifyRequest, @Res() rep: FastifyReply) {
    const update = req.body as Update;

    await this.telegramService.handleUpdate(update);

    rep.send(200);
  }
}
