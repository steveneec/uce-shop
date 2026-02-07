import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  
  // Habilita el pipe de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilita CORS para peticiones de origen cruzado
  app.enableCors();

  const port = process.env.SERVICE_PORT || 3003;
  await app.listen(port);
  
  console.log(`Order Service is running on port ${port}`);
}
bootstrap();
