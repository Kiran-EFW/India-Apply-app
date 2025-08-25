import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:3000';

export const applicationService = {
  async submitApplication(serviceType: string, applicationData: any) {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/applications/${serviceType}`,
        applicationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Application submission error:', error);
      throw new Error('Failed to submit application');
    }
  },

  async getApplicationStatus(applicationId: string) {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/applications/${applicationId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      throw new Error('Failed to get application status');
    }
  },

  async getUserApplications() {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Applications fetch error:', error);
      throw new Error('Failed to fetch applications');
    }
  },

  async getApplication(applicationId: string) {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Application fetch error:', error);
      throw new Error('Failed to fetch application');
    }
  },
};
