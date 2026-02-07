import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) {}

  @Post()
  async createCustomer(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerServiceService.createCustomer(createCustomerDto);
  }

  @Get()
  async findAllCustomers(): Promise<Customer[]> {
    return await this.customerServiceService.findAllCustomers();
  }

  @Get(':id')
  async findCustomerById(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerServiceService.findCustomerById(id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    return await this.customerServiceService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.customerServiceService.deleteCustomer(id);
    return { message: `Customer with ID ${id} deleted successfully` };
  }
}
