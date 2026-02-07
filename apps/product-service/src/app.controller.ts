import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createProduct(@Body(ValidationPipe) createProductDto: CreateProductDto): Promise<Product> {
    return await this.appService.createProduct(createProductDto);
  }

  @Get()
  async findAllProducts(@Query('category') category?: string): Promise<Product[]> {
    if (category) {
      return await this.appService.findProductsByCategory(category);
    }
    return await this.appService.findAllProducts();
  }

  @Get(':id')
  async findProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.appService.findProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return await this.appService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.appService.deleteProduct(id);
    return { message: `Product with ID ${id} deleted successfully` };
  }

  @Get(':id/stock/:quantity')
  async checkStock(
    @Param('id', ParseIntPipe) id: number,
    @Param('quantity', ParseIntPipe) quantity: number
  ): Promise<{ available: boolean; product: Product }> {
    const product = await this.appService.findProductById(id);
    const available = await this.appService.checkStock(id, quantity);
    return { available, product };
  }
}
