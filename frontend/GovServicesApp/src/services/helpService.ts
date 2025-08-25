import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:3000';

export const helpService = {
  // FAQ Methods
  async getFAQs(category?: string) {
    try {
      const params = category ? { category } : {};
      const response = await axios.get(`${API_URL}/help/faqs`, { params });
      return response.data;
    } catch (error) {
      console.error('FAQ fetch error:', error);
      throw new Error('Failed to fetch FAQs');
    }
  },

  async getFAQById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/help/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('FAQ fetch error:', error);
      throw new Error('Failed to fetch FAQ');
    }
  },

  async searchFAQs(query: string) {
    try {
      const response = await axios.get(`${API_URL}/help/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('FAQ search error:', error);
      throw new Error('Failed to search FAQs');
    }
  },

  // Support Ticket Methods
  async createSupportTicket(ticketData: any) {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/help/tickets`,
        ticketData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Support ticket creation error:', error);
      throw new Error('Failed to create support ticket');
    }
  },

  async getSupportTicket(id: string) {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/help/tickets/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Support ticket fetch error:', error);
      throw new Error('Failed to fetch support ticket');
    }
  },

  async getUserSupportTickets() {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/help/tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('User support tickets fetch error:', error);
      throw new Error('Failed to fetch user support tickets');
    }
  },

  async updateTicketStatus(id: string, status: string) {
    try {
      const token = await getToken();
      const response = await axios.put(
        `${API_URL}/help/tickets/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ticket status update error:', error);
      throw new Error('Failed to update ticket status');
    }
  },

  // Ticket Response Methods
  async addTicketResponse(ticketId: string, responseData: any) {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/help/tickets/${ticketId}/responses`,
        responseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ticket response creation error:', error);
      throw new Error('Failed to add ticket response');
    }
  },

  async getTicketResponses(ticketId: string) {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/help/tickets/${ticketId}/responses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ticket responses fetch error:', error);
      throw new Error('Failed to fetch ticket responses');
    }
  },

  // Analytics Methods
  async getHelpAnalytics() {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/help/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Help analytics error:', error);
      throw new Error('Failed to fetch help analytics');
    }
  },
};
