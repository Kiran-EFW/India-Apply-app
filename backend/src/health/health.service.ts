import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import axios from 'axios';

@Injectable()
export class HealthService {
  constructor(private dataSource: DataSource) {}

  async checkAllServices() {
    const startTime = Date.now();
    
    const [database, elevenlabs, razorpay, azure] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkElevenLabs(),
      this.checkRazorpay(),
      this.checkAzureSpeech(),
    ]);

    return {
      database: database.status === 'fulfilled' ? database.value : { status: 'down', error: database.reason },
      elevenlabs: elevenlabs.status === 'fulfilled' ? elevenlabs.value : { status: 'down', error: elevenlabs.reason },
      razorpay: razorpay.status === 'fulfilled' ? razorpay.value : { status: 'down', error: razorpay.reason },
      azure: azure.status === 'fulfilled' ? azure.value : { status: 'down', error: azure.reason },
      response_time: Date.now() - startTime,
    };
  }

  async checkDatabase() {
    const startTime = Date.now();
    try {
      const isConnected = this.dataSource.isInitialized;
      if (!isConnected) {
        throw new Error('Database not initialized');
      }
      
      // Test query
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'connected',
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkElevenLabs() {
    const startTime = Date.now();
    try {
      const apiKey = process.env.ELEVEN_LABS_API_KEY;
      if (!apiKey) {
        throw new Error('Eleven Labs API key not configured');
      }

      const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey,
        },
        timeout: 5000,
      });

      return {
        status: 'connected',
        response_time: Date.now() - startTime,
        voices_count: response.data.voices?.length || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkRazorpay() {
    const startTime = Date.now();
    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials not configured');
      }

      // Test Razorpay API with basic auth
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await axios.get('https://api.razorpay.com/v1/orders', {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        params: {
          count: 1,
        },
        timeout: 5000,
      });

      return {
        status: 'connected',
        response_time: Date.now() - startTime,
        orders_count: response.data.count || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkAzureSpeech() {
    const startTime = Date.now();
    try {
      const apiKey = process.env.AZURE_SPEECH_KEY;
      const region = process.env.AZURE_SPEECH_REGION;
      
      if (!apiKey || !region) {
        throw new Error('Azure Speech credentials not configured');
      }

      // Test Azure Speech API
      const response = await axios.get(`https://${region}.api.cognitive.microsoft.com/speechtotext/v3.0/models`, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
        timeout: 5000,
      });

      return {
        status: 'connected',
        response_time: Date.now() - startTime,
        models_count: response.data.values?.length || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
