import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from 'src/schemas/categories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryOptionsCategoryDto } from './dto/query-options-category.dto';
import { PaginatedResponse } from 'src/common/types';

type CategoryQuery = {
  status?: boolean;
  name?: { $regex: string; $options: string };
  code?: { $eq: string | number };
};

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Categories.name) private categoryModel: Model<Categories>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAll(queryOptionsCategoryDto: QueryOptionsCategoryDto): Promise<PaginatedResponse<Categories>> {
    const { limit, page, code, status, name } = queryOptionsCategoryDto;

    const query: CategoryQuery = {};

    if (typeof status === 'boolean') query.status = status;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (code) query.code = { $eq: code };

    const categories = await this.categoryModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.categoryModel.countDocuments(query).exec();

    return {
      categories,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(code: number): Promise<Categories> {
    const category = await this.categoryModel.findOne({ code }).select('-__v');
    return category;
  }
  async findById(id: Types.ObjectId): Promise<Categories> {
    const category = await this.categoryModel.findById(id).lean().select('-__v');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedProduct = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    return updatedProduct;
  }

  async removeById(id: string) {
    const removedCategory = await this.categoryModel.findByIdAndDelete(id);
    return removedCategory;
  }

  async removeOne(code: number) {
    const removedCategory = await this.categoryModel.findOneAndDelete({ code });
    return removedCategory;
  }
}
