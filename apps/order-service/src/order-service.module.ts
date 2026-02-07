import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { HealthController } from './health.controller';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'uceshop_user'),
        password: configService.get('POSTGRES_PASSWORD', 'uceshop_password'),
        database: configService.get('POSTGRES_DB', 'uceshop'),
        entities: [Order],
        synchronize: false, // Usando gestión manual del esquema
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderServiceController, HealthController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
