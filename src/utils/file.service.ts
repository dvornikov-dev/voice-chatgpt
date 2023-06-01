import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassThrough } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class FileService {
  constructor(private readonly httpService: HttpService) {}

  public async convertFileToMp3(fileUrl: string): Promise<PassThrough> {
    const convertedFileOutputStream = new PassThrough();

    ffmpeg(fileUrl)
      .noVideo()
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .pipe(convertedFileOutputStream, { end: true });

    return convertedFileOutputStream;
  }
}
