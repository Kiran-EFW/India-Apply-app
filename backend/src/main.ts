import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Serve static files from web directory
  app.useStaticAssets(join(__dirname, '..', '..', 'web'));
  
  // Global prefix for API routes
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Apply AI India Backend running on port ${port}`);
  console.log(`📊 Health check available at: http://localhost:${port}/api/health`);
  console.log(`🌐 Web application available at: http://localhost:${port}/index.html`);
}

bootstrap();
