import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ElevenLabsService {
  private readonly apiKey = process.env.ELEVEN_LABS_API_KEY;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  async textToSpeech(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL'): Promise<Buffer> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error in Eleven Labs TTS:', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  async getVoices() {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw new Error('Failed to fetch voices');
    }
  }
}
