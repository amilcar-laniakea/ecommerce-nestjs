import {
  Controller,
  Get,
  Post,
  Body,
  ConflictException,
  NotFoundException,
  Req,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiResponse } from 'src/common/utils/api-response';
import { UpdateProductDto } from './dto/update-product.dto';
import { customSuccessCodes } from 'src/common/constants/success-codes';
import { productSuccessCodes } from './constants/success-messages';
import { productErrorCodes } from './constants/error-messages';
import { ParseObjectIdNumberPipe } from 'src/common/pipes/parse-object-id-number.pipe';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { QueryOptionsProductDto } from './dto/query-options-product.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() body: CreateProductDto, @Req() request: Request) {
    try {
      const response = await this.productsService.create(body);
      return ApiResponse.success({
        data: response,
        message: productSuccessCodes.SUCCESS_CREATE,
        customCode: customSuccessCodes.ResourceCreated,
        originUrl: request.url,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(productErrorCodes.ERROR_CONFLICT);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query() options: QueryOptionsProductDto, @Req() request: Request) {
    try {
      let paginationOptions: QueryOptionsProductDto = {
        limit: options.limit !== undefined && options.limit !== null ? options.limit : 10,
        page: options.page || 1,
      };

      if (options.name) paginationOptions = { ...paginationOptions, name: options.name };
      if (options.category) paginationOptions = { ...paginationOptions, category: options.category };
      if (options.code) paginationOptions = { ...paginationOptions, code: options.code };
      if (options.sort) paginationOptions = { ...paginationOptions, sort: options.sort === 'asc' ? 'asc' : 'desc' };
      if (typeof options.stock === 'boolean') paginationOptions = { ...paginationOptions, stock: options.stock };
      if (typeof options.status === 'boolean') paginationOptions = { ...paginationOptions, status: options.status };

      const response = await this.productsService.findAll(paginationOptions);

      return ApiResponse.success({
        data: response,
        message: productSuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdNumberPipe) id: string, @Req() request: Request) {
    try {
      let response: null | CreateProductDto;

      if (!isNaN(Number(id))) {
        response = await this.productsService.findOne(Number(id));
      } else {
        response = await this.productsService.findById(id);
      }

      if (!response) {
        throw new NotFoundException(productErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: productSuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateProductDto: UpdateProductDto, @Req() request: Request) {
    try {
      const response = await this.productsService.update(id, updateProductDto);

      if (!response) {
        throw new NotFoundException(productErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: productSuccessCodes.SUCCESS_UPDATE,
        customCode: customSuccessCodes.ResourceUpdated,
        originUrl: request.url,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(productErrorCodes.ERROR_CONFLICT);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdNumberPipe) id: string, @Req() request: Request) {
    try {
      let response: null | CreateProductDto;
      if (!isNaN(Number(id))) {
        response = await this.productsService.removeOne(Number(id));
      } else {
        response = await this.productsService.removeById(id);
      }

      if (!response) {
        throw new NotFoundException(productErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: productSuccessCodes.SUCCESS_DELETE,
        customCode: customSuccessCodes.ResourceDeleted,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }
}
