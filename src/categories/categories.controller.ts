import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ConflictException,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from 'src/common/utils/api-response';
import { customSuccessCodes } from 'src/common/constants/success-codes';
import { categorySuccessCodes } from './constants/success-messages';
import { categoryErrorCodes } from './constants/error-messages';
import { ParseObjectIdNumberPipe } from 'src/common/pipes/parse-object-id-number.pipe';
import { Types } from 'mongoose';
import { QueryOptionsCategoryDto } from './dto/query-options-category.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() body: CreateCategoryDto, @Req() request: Request) {
    try {
      const response = await this.categoriesService.create(body);
      return ApiResponse.create({
        data: response,
        message: categorySuccessCodes.SUCCESS_CREATE,
        customCode: customSuccessCodes.ResourceCreated,
        originUrl: request.url,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(categoryErrorCodes.ERROR_CONFLICT);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query() options: QueryOptionsCategoryDto, @Req() request: Request) {
    try {
      let paginationOptions: QueryOptionsCategoryDto = {
        limit: options.limit !== undefined && options.limit !== null ? options.limit : 10,
        page: options.page || 1,
      };

      if (options.name) paginationOptions = { ...paginationOptions, name: options.name };
      if (options.code) paginationOptions = { ...paginationOptions, code: options.code };
      if (typeof options.status === 'boolean') paginationOptions = { ...paginationOptions, status: options.status };

      const response = await this.categoriesService.findAll(paginationOptions);

      return ApiResponse.success({
        data: response,
        message: categorySuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdNumberPipe) id: Types.ObjectId, @Req() request: Request) {
    try {
      let response: null | CreateCategoryDto;

      if (!isNaN(Number(id))) {
        response = await this.categoriesService.findOne(Number(id));
      } else {
        response = await this.categoriesService.findById(id);
      }

      if (!response) {
        throw new NotFoundException(categoryErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: categorySuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() request: Request,
  ) {
    try {
      const response = await this.categoriesService.update(id, updateCategoryDto);

      if (!response) {
        throw new NotFoundException(categoryErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: categorySuccessCodes.SUCCESS_UPDATE,
        customCode: customSuccessCodes.ResourceUpdated,
        originUrl: request.url,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(categoryErrorCodes.ERROR_CONFLICT);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdNumberPipe) id: string, @Req() request: Request) {
    try {
      let response: null | CreateCategoryDto;
      if (!isNaN(Number(id))) {
        response = await this.categoriesService.removeOne(Number(id));
      } else {
        response = await this.categoriesService.removeById(id);
      }

      if (!response) {
        throw new NotFoundException(categoryErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: categorySuccessCodes.SUCCESS_DELETE,
        customCode: customSuccessCodes.ResourceDeleted,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }
}
