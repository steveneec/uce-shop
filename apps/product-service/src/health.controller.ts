import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('actuator/health')
  getHealth(): { status: string; timestamp: string; service: string } {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'product-service'
    };
  }
}