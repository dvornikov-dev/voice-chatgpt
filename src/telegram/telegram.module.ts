import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../utils/file.service';
import { OpenAiService } from '../utils/open-ai.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('openai.apiUrl'),
        timeout: 20 * 1000,
        maxRedirects: 5,
        headers: {
          Authorization: `Bearer ${configService.get<string>('openai.apiKey')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, FileService, OpenAiService],
})
export class TelegramModule {}
