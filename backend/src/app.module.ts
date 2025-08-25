import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { ServicesModule } from './services/services.module';
import { ElevenLabsModule } from './elevenlabs/elevenlabs.module';
import { OcrModule } from './ocr/ocr.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { UTRModule } from './utr/utr.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DocumentsModule,
    ServicesModule,
    ElevenLabsModule,
    OcrModule,
    RazorpayModule,
    UTRModule,
    ApplicationModule,
  ],
})
export class AppModule {}
