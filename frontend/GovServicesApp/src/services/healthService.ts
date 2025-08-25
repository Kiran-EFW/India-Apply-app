import axios from 'axios';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: ServiceStatus;
    elevenlabs: ServiceStatus;
    razorpay: ServiceStatus;
    azure: ServiceStatus;
  };
  response_time: number;
}

export interface ServiceStatus {
  status: 'connected' | 'disconnected' | 'down';
  response_time?: number;
  error?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface ConnectivityStatus {
  endpoint: string;
  status: 'up' | 'down';
  response_time?: number;
  error?: string;
}

export const healthService = {
  async checkBackendHealth(): Promise<HealthStatus> {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000,
      });
      
      return {
        ...response.data,
        response_time: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Backend service unavailable: ${error.message}`);
    }
  },

  async checkConnectivity(): Promise<ConnectivityStatus[]> {
    const endpoints = [
      '/api/auth',
      '/api/documents',
      '/api/services',
      '/api/payments',
      '/api/utr',
      '/api/help',
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const startTime = Date.now();
        try {
          await axios.get(`${API_BASE_URL}${endpoint}`, {
            timeout: 5000,
          });
          return {
            endpoint,
            status: 'up' as const,
            response_time: Date.now() - startTime,
          };
        } catch (error) {
          return {
            endpoint,
            status: 'down' as const,
            response_time: Date.now() - startTime,
            error: error.message,
          };
        }
      })
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          endpoint: endpoints[index],
          status: 'down' as const,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  },

  async checkDatabaseHealth(): Promise<ServiceStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/database`);
      return response.data;
    } catch (error) {
      throw new Error(`Database health check failed: ${error.message}`);
    }
  },

  async checkElevenLabsHealth(): Promise<ServiceStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/elevenlabs`);
      return response.data;
    } catch (error) {
      throw new Error(`Eleven Labs health check failed: ${error.message}`);
    }
  },

  async checkRazorpayHealth(): Promise<ServiceStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/razorpay`);
      return response.data;
    } catch (error) {
      throw new Error(`Razorpay health check failed: ${error.message}`);
    }
  },

  async checkAzureSpeechHealth(): Promise<ServiceStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/azure-speech`);
      return response.data;
    } catch (error) {
      throw new Error(`Azure Speech health check failed: ${error.message}`);
    }
  },

  // Performance monitoring
  trackApiCall(endpoint: string) {
    const startTime = Date.now();
    return {
      end: (success: boolean = true) => {
        const duration = Date.now() - startTime;
        console.log(`API Call: ${endpoint} - ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`);
        
        // In production, send to analytics service
        if (process.env.NODE_ENV === 'production') {
          // Send to analytics
          this.sendAnalytics({
            type: 'api_call',
            endpoint,
            duration,
            success,
            timestamp: new Date().toISOString(),
          });
        }
      },
    };
  },

  trackAppLaunch() {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        console.log(`App Launch Time: ${duration}ms`);
        
        if (process.env.NODE_ENV === 'production') {
          this.sendAnalytics({
            type: 'app_launch',
            duration,
            timestamp: new Date().toISOString(),
          });
        }
      },
    };
  },

  // Analytics helper (placeholder for production)
  private sendAnalytics(data: any) {
    // In production, implement actual analytics service
    // For now, just log to console
    console.log('Analytics:', data);
  },

  // Network connectivity check
  async checkNetworkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Comprehensive health check
  async performFullHealthCheck(): Promise<{
    backend: HealthStatus | null;
    connectivity: ConnectivityStatus[];
    network: boolean;
    timestamp: string;
  }> {
    const timestamp = new Date().toISOString();
    
    try {
      const [backend, connectivity, network] = await Promise.allSettled([
        this.checkBackendHealth(),
        this.checkConnectivity(),
        this.checkNetworkConnectivity(),
      ]);

      return {
        backend: backend.status === 'fulfilled' ? backend.value : null,
        connectivity: connectivity.status === 'fulfilled' ? connectivity.value : [],
        network: network.status === 'fulfilled' ? network.value : false,
        timestamp,
      };
    } catch (error) {
      return {
        backend: null,
        connectivity: [],
        network: false,
        timestamp,
      };
    }
  },
};
