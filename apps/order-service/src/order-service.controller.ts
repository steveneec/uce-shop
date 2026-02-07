import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, ValidationPipe, BadRequestException } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto, OrderSummary } from './dto/order.dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Post()
  async createOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto): Promise<OrderSummary> {
    return await this.orderServiceService.createOrder(createOrderDto);
  }

  @Get()
  async findAllOrders(@Query('customerId') customerIdParam?: string): Promise<Order[]> {
    if (customerIdParam) {
      const customerId = parseInt(customerIdParam, 10);
      if (isNaN(customerId)) {
        throw new BadRequestException('customerId must be a valid number');
      }
      return await this.orderServiceService.findOrdersByCustomerId(customerId);
    }
    return await this.orderServiceService.findAllOrders();
  }

  @Get(':id')
  async findOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.orderServiceService.findOrderById(id);
  }

  @Get(':id/summary')
  async getOrderSummary(@Param('id', ParseIntPipe) id: number): Promise<OrderSummary> {
    return await this.orderServiceService.getOrderSummary(id);
  }
}
