import { IsString, IsNumber, IsOptional, IsNotEmpty, MaxLength, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0.01)
  price: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0.01)
  @IsOptional()
  price?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;
}