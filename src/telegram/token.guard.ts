import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers['x-telegram-bot-api-secret-token']) return false;
    const secretToken = request.headers['x-telegram-bot-api-secret-token'];

    const configSecretToken = this.configService.get<string>(
      'telegram.secretToken',
    );

    return secretToken === configSecretToken;
  }
}
