import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Order } from './entities/order.entity';
import { CreateOrderDto, CustomerResponse, ProductResponse, OrderSummary } from './dto/order.dto';

@Injectable()
export class OrderServiceService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderSummary> {
    const { customerId, productId, quantity } = createOrderDto;

    // Step 1: Validate customer exists
    const customer = await this.validateCustomer(customerId);

    // Step 2: Validate product exists and has sufficient stock
    const product = await this.validateProduct(productId, quantity);

    // Step 3: Calculate total amount
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    // Paso 4: Crear y guardar la orden
    const order = this.orderRepository.create({
      customerId,
      productId,
      quantity,
      unitPrice,
      totalAmount,
      status: 'CONFIRMED',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Opcional: Actualizar stock del producto (si está implementado en product service)
    // await this.updateProductStock(productId, quantity);

    return {
      orderId: savedOrder.id,
      customer,
      product,
      quantity,
      unitPrice,
      totalAmount,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
    };
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findOrdersByCustomerId(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderSummary(id: number): Promise<OrderSummary> {
    const order = await this.findOrderById(id);
    
    try {
      const [customer, product] = await Promise.all([
        this.validateCustomer(order.customerId),
        this.getProductById(order.productId)
      ]);

      return {
        orderId: order.id,
        customer,
        product,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      };
    } catch (error) {
      // Si no podemos obtener detalles del cliente o producto, devolver información básica de la orden
      throw new BadRequestException('Unable to retrieve complete order information');
    }
  }

  private async validateCustomer(customerId: number): Promise<CustomerResponse> {
    const customerServiceUrl = this.configService.get('CUSTOMER_SERVICE_URL', 'http://customer-service:3001');
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${customerServiceUrl}/customers/${customerId}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
      throw new BadRequestException(`Failed to validate customer: ${error.message}`);
    }
  }

  private async validateProduct(productId: number, quantity: number): Promise<ProductResponse> {
    const productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL', 'http://product-service:3002');
    
    try {
      // Primero, obtener detalles del producto
      const productResponse = await firstValueFrom(
        this.httpService.get(`${productServiceUrl}/products/${productId}`)
      );
      
      const product = productResponse.data;
      
      // Verificar si hay suficiente stock disponible
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`
        );
      }

      return product;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to validate product: ${error.message}`);
    }
  }

  private async getProductById(productId: number): Promise<ProductResponse> {
    const productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL', 'http://product-service:3002');
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${productServiceUrl}/products/${productId}`)
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }
}
