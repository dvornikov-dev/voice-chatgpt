import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, NarrowedContext, Telegraf } from 'telegraf';
import type { Update, Message } from 'telegraf/types';
import { message } from 'telegraf/filters';
import OnMessage from './decorators/on-event.decorator';
import { FileService } from '../utils/file.service';
import { OpenAiService } from '../utils/open-ai.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly openAiService: OpenAiService,
  ) {
    const botToken = this.configService.get<string>('telegram.botToken');
    this.bot = new Telegraf(botToken);
    this.setupListeners();
  }

  private setupListeners() {
    this.bot.start(this.startCommand.bind(this));

    const prototype = Object.getPrototypeOf(this);
    const methods = Object.getOwnPropertyNames(prototype);

    methods.forEach((methodName) => {
      const method = this[methodName];

      if (typeof method === 'function') {
        const messageType = Reflect.getMetadata(
          'messageHandler',
          prototype,
          methodName,
        );

        if (messageType) {
          this.bot.on(message(messageType), method.bind(this));
        }
      }
    });
  }

  private async startCommand(ctx: Context) {
    ctx.reply("Hi, I'm a bot!");
  }

  @OnMessage('voice')
  private async voiceMessage(
    ctx: NarrowedContext<
      Context<Update>,
      Update.MessageUpdate<Message.VoiceMessage>
    >,
  ) {
    const file = await this.bot.telegram.getFileLink(ctx.message.voice.file_id);

    const fileStream = await this.fileService.convertFileToMp3(file.href);

    const { text } = await this.openAiService.getVoiceText(fileStream);

    const completion = await this.openAiService.getGptCompletion(text);

    this.logger.log(`Voice message: ${text}`);
    this.logger.log(`Completion: ${completion}`);

    ctx.reply(completion);
  }

  async handleUpdate(update: Update) {
    await this.bot.handleUpdate(update);
  }
}
