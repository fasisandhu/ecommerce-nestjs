import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterProductDto } from './dtos/filter-product-dto';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dtos/create-product-dto';

@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async getProds(
    @Query()
    filters: FilterProductDto,
  ): Promise<Product[]> {
    if (Object.keys(filters).length) {
      const products = await this.productService.getFilteredProducts(filters);

      return products;
    } else {
      const products = await this.productService.getProducts();

      return products;
    }
  }

  @Post('addProduct')
  async addProduct(
    @Body()
    product: CreateProductDto,
  ): Promise<Product> {
    const newprod = await this.productService.addProduct(product);

    return newprod;
  }

  @Post(':id')
  async getProductById(
    @Param('id')
    id: string,
  ): Promise<Product> {
    const prod = await this.productService.getProduct(id);

    return prod;
  }

  @Put(':id')
  async updateProduct(
    @Body()
    product: CreateProductDto,

    @Param('id')
    id: string,
  ): Promise<Product> {
    const newprod = await this.productService.updateProduct(id, product);
    return newprod;
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    const prod = await this.productService.deleteProduct(id);
    return prod;
  }
}
