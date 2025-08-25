import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FAQ, SupportTicket, TicketResponse } from './help.entity';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(FAQ)
    private faqRepository: Repository<FAQ>,
    @InjectRepository(SupportTicket)
    private supportTicketRepository: Repository<SupportTicket>,
    @InjectRepository(TicketResponse)
    private ticketResponseRepository: Repository<TicketResponse>,
  ) {}

  // FAQ Methods
  async getFAQs(category?: string) {
    try {
      const query = this.faqRepository.createQueryBuilder('faq')
        .where('faq.isActive = :isActive', { isActive: true });
      
      if (category) {
        query.andWhere('faq.category = :category', { category });
      }
      
      return await query.orderBy('faq.viewCount', 'DESC').getMany();
    } catch (error) {
      console.error('FAQ fetch error:', error);
      throw new Error('Failed to fetch FAQs');
    }
  }

  async getFAQById(id: string) {
    try {
      const faq = await this.faqRepository.findOne({ where: { id } });
      if (faq) {
        // Increment view count
        faq.viewCount += 1;
        await this.faqRepository.save(faq);
      }
      return faq;
    } catch (error) {
      console.error('FAQ fetch error:', error);
      throw new Error('Failed to fetch FAQ');
    }
  }

  async searchFAQs(query: string) {
    try {
      return await this.faqRepository.find({
        where: [
          { question: Like(`%${query}%`), isActive: true },
          { answer: Like(`%${query}%`), isActive: true },
        ],
        order: { viewCount: 'DESC' },
      });
    } catch (error) {
      console.error('FAQ search error:', error);
      throw new Error('Failed to search FAQs');
    }
  }

  // Support Ticket Methods
  async createSupportTicket(userId: string, ticketData: any) {
    try {
      const ticket = this.supportTicketRepository.create({
        userId,
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category || 'general',
        priority: ticketData.priority || 'medium',
      });

      return await this.supportTicketRepository.save(ticket);
    } catch (error) {
      console.error('Support ticket creation error:', error);
      throw new Error('Failed to create support ticket');
    }
  }

  async getSupportTicket(id: string) {
    try {
      const ticket = await this.supportTicketRepository.findOne({ where: { id } });
      if (ticket) {
        const responses = await this.ticketResponseRepository.find({
          where: { ticketId: id },
          order: { createdAt: 'ASC' },
        });
        return { ...ticket, responses };
      }
      return ticket;
    } catch (error) {
      console.error('Support ticket fetch error:', error);
      throw new Error('Failed to fetch support ticket');
    }
  }

  async getUserSupportTickets(userId: string) {
    try {
      return await this.supportTicketRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('User support tickets fetch error:', error);
      throw new Error('Failed to fetch user support tickets');
    }
  }

  async updateTicketStatus(id: string, status: string) {
    try {
      const ticket = await this.supportTicketRepository.findOne({ where: { id } });
      if (ticket) {
        ticket.status = status;
        return await this.supportTicketRepository.save(ticket);
      }
      throw new Error('Ticket not found');
    } catch (error) {
      console.error('Ticket status update error:', error);
      throw new Error('Failed to update ticket status');
    }
  }

  // Ticket Response Methods
  async addTicketResponse(ticketId: string, responseData: any) {
    try {
      const response = this.ticketResponseRepository.create({
        ticketId,
        message: responseData.message,
        isAgent: responseData.isAgent || false,
        agentId: responseData.agentId || null,
      });

      const savedResponse = await this.ticketResponseRepository.save(response);

      // Update ticket status if it's a user response
      if (!responseData.isAgent) {
        await this.updateTicketStatus(ticketId, 'in_progress');
      }

      return savedResponse;
    } catch (error) {
      console.error('Ticket response creation error:', error);
      throw new Error('Failed to add ticket response');
    }
  }

  async getTicketResponses(ticketId: string) {
    try {
      return await this.ticketResponseRepository.find({
        where: { ticketId },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      console.error('Ticket responses fetch error:', error);
      throw new Error('Failed to fetch ticket responses');
    }
  }

  // Analytics Methods
  async getHelpAnalytics() {
    try {
      const totalFAQs = await this.faqRepository.count({ where: { isActive: true } });
      const totalTickets = await this.supportTicketRepository.count();
      const openTickets = await this.supportTicketRepository.count({ where: { status: 'open' } });
      const resolvedTickets = await this.supportTicketRepository.count({ where: { status: 'resolved' } });

      return {
        totalFAQs,
        totalTickets,
        openTickets,
        resolvedTickets,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0,
      };
    } catch (error) {
      console.error('Help analytics error:', error);
      throw new Error('Failed to fetch help analytics');
    }
  }
}
