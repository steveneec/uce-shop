import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === '23505') { // violación de restricción de unicidad
        throw new ConflictException('Customer with this email already exists');
      }
      throw error;
    }
  }

  async findAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findCustomerById(id);
    
    try {
      Object.assign(customer, updateCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === '23505') { // violación de restricción de unicidad
        throw new ConflictException('Customer with this email already exists');
      }
      throw error;
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    const customer = await this.findCustomerById(id);
    await this.customerRepository.remove(customer);
  }

  async findCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { email } });
    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    return customer;
  }
}
