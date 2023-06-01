import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassThrough } from 'node:stream';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenAiService {
  constructor(private readonly httpService: HttpService) {}

  public async getVoiceText(
    fileStream: PassThrough,
  ): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('file', fileStream, 'audio.mp3');
    formData.append('model', 'whisper-1');

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    const response = await firstValueFrom(
      this.httpService.post('audio/translations', formData, {
        headers,
      }),
    );

    return response.data;
  }

  public async getGptCompletion(text: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post('chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You must answer in Russian',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    );

    return response.data.choices[0].message.content;
  }
}
