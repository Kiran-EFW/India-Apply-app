import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Request() req) {
    // Validate the document
    await this.documentsService.validateDocument(file);
    
    // Upload the document
    const result = await this.documentsService.uploadDocument(file, req.user.id);
    
    // Process the document (OCR, etc.)
    const processed = await this.documentsService.processDocument(file);
    
    return {
      success: true,
      document: result,
      processed,
      message: 'Document uploaded and processed successfully',
    };
  }
}
