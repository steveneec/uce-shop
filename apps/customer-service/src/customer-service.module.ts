import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { HealthController } from './health.controller';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
        entities: [Customer],
        synchronize: false, // Usando gestión manual del esquema
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [CustomerServiceController, HealthController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}
