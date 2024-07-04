import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import mongoose from 'mongoose';
import { CreateProductDto } from './dtos/create-product-dto';
import { FilterProductDto } from './dtos/filter-product-dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private ProductModel:mongoose.Model<ProductDocument>
    ){}

    async getProducts(): Promise<Product[]>{
        const products=await this.ProductModel.find().exec();
        
        return products;
    }

    async getProduct(id:string): Promise<Product>{
        const prod= await this.ProductModel.findById(id).exec();

        return prod;
    }

    async addProduct(product:CreateProductDto): Promise<Product>{
        const newprod=await this.ProductModel.create(product);
        return newprod.save();
    }

    async updateProduct(id:string, product:CreateProductDto): Promise<Product>{
            const updated=await this.ProductModel.findByIdAndUpdate(id, product)

            return updated;
    }

    async deleteProduct(id:string): Promise<Product>{
        const deleted=await this.ProductModel.findByIdAndDelete(id);
        
        return deleted
    }

    async getFilteredProducts(filters:FilterProductDto):Promise<Product[]>{

        const {search,category} = filters

        let products=await this.getProducts()

        if (search){
            products=products.filter(product=>product.name.includes(search) || product.author.includes(search))
        }

        if (category){
            products=products.filter(product=>product.category===category)
        }

        return products

    }

}
