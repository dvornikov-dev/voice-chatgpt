import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import telegramConfig from './config/telegram.config';
import openaiConfig from './config/openai.config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      load: [appConfig, telegramConfig, openaiConfig],
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('app.logLevel'),
          transport: {
            target: 'pino-pretty',
            options: {
              levelFirst: true,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
              singleLine: true,
              colorize: true,
              encoding: 'utf-8',
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
