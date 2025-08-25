import { Controller, Post, Get, UseInterceptors, UploadedFile, Param, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    // In a real app, we'd get userId from JWT token
    const userId = 'user_123';
    return await this.documentsService.uploadDocument(file, userId);
  }

  @Get('user/:userId')
  async getUserDocuments(@Param('userId') userId: string) {
    return await this.documentsService.getUserDocuments(userId);
  }
}
