import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products } from 'src/schemas/products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryOptionsProductDto } from './dto/query-options-product.dto';
import { PaginatedResponse } from 'src/common/types';

type ProductQuery = {
  status?: boolean;
  stock?: { $gt?: number; $eq?: number };
  name?: { $regex: string; $options: string };
  category?: string;
  code?: { $eq: string | number };
};

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Products.name) private productModel: Model<Products>) {}

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(queryOptionsProductDto: QueryOptionsProductDto): Promise<PaginatedResponse<Products>> {
    const { limit, page, category, sort, code, stock, status, name } = queryOptionsProductDto;

    const query: ProductQuery = {};

    if (typeof status === 'boolean') query.status = status;
    if (typeof stock === 'boolean') query.stock = stock === true ? { $gt: 0 } : { $eq: 0 };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (code) query.code = { $eq: code };

    const sortOption = sort ? { price: sort } : {};

    const products = await this.productModel
      .find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .select('-__v')
      .exec();

    const total = await this.productModel.countDocuments(query).exec();

    return {
      products: products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Products> {
    const product = await this.productModel.findById(id).select('-__v');
    return product;
  }

  async findOne(code: number): Promise<Products> {
    const product = await this.productModel.findOne({ code }).select('-__v');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).select('-__v');
    return updatedProduct;
  }

  async removeById(id: string) {
    const removedProduct = await this.productModel.findByIdAndDelete(id).select('-__v');
    return removedProduct;
  }

  async removeOne(code: number) {
    const removedProduct = await this.productModel.findOneAndDelete({ code }).select('-__v');
    return removedProduct;
  }
}
