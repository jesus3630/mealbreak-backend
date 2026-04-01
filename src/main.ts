import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  app.enableCors({ origin: [frontendUrl, 'http://localhost:4200'], credentials: true });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend running on http://localhost:3000/api`);
}
bootstrap();
