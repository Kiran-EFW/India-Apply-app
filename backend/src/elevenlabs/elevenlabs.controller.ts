import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { ElevenLabsService } from './elevenlabs.service';
import { Response } from 'express';

@Controller('elevenlabs')
export class ElevenLabsController {
  constructor(private readonly elevenLabsService: ElevenLabsService) {}

  @Post('text-to-speech')
  async textToSpeech(@Body('text') text: string, @Res() res: Response) {
    if (!text) {
      return res.status(400).send('Text is required');
    }

    try {
      const audioBuffer = await this.elevenLabsService.textToSpeech(text);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
      });
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).send('Failed to generate speech');
    }
  }

  @Get('voices')
  async getVoices() {
    try {
      return await this.elevenLabsService.getVoices();
    } catch (error) {
      throw new Error('Failed to fetch voices');
    }
  }
}
