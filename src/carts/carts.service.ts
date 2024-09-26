import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Carts, CartsDocument, CartStatus } from 'src/schemas/carts/carts.schema';
import { Model } from 'mongoose';
import { PaginatedResponse } from 'src/common/types';
import { QueryOptionsCartDto } from './dto/query-options-cart.dto';

type CartQuery = {
  status?: CartStatus;
};

@Injectable()
export class CartsService {
  constructor(@InjectModel(Carts.name) private cartModel: Model<Carts>) {}
  async create(createCartDto: CreateCartDto): Promise<Carts> {
    const newCart = new this.cartModel(createCartDto);
    return newCart.save();
  }

  async findAll(queryOptionsCartDto: QueryOptionsCartDto): Promise<PaginatedResponse<Carts>> {
    const { limit, page, status } = queryOptionsCartDto;

    const query: CartQuery = {};

    if (status) query.status = status;

    const carts = await this.cartModel
      .find(query)
      .populate({
        path: 'products.product',
        model: 'Products',
        populate: {
          path: 'categories',
          model: 'Categories',
        },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .lean()
      .exec();

    const total = await this.cartModel.countDocuments(query).exec();

    return {
      carts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CartsDocument> {
    const cart = await this.cartModel
      .findById(id)
      .populate({
        path: 'products.product',
        model: 'Products',
        populate: {
          path: 'categories',
          model: 'Categories',
        },
      })
      .exec();
    return cart;
  }

  async updateCart(cart: CartsDocument): Promise<Carts> {
    const updatedCart = await cart.save();
    return updatedCart;
  }

  async removeById(id: string) {
    const removedCart = await this.cartModel.findByIdAndDelete(id);
    return removedCart;
  }
}
