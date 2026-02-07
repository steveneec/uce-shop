import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  customerId: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;
}

// DTOs para respuestas de servicios externos
export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
}

export interface OrderSummary {
  orderId: number;
  customer: CustomerResponse;
  product: ProductResponse;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}