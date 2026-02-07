import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita el pipe de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilita CORS para peticiones de origen cruzado
  app.enableCors();

  const port = process.env.SERVICE_PORT || 3002;
  await app.listen(port);
  
  console.log(`Product Service is running on port ${port}`);
}
bootstrap();
