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
  BadRequestException,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiResponse } from 'src/common/utils/api-response';
import { cartSuccessCodes } from './constants/success-messages';
import { customSuccessCodes } from 'src/common/constants/success-codes';
import { cartErrorCodes } from './constants/error-messages';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { QueryOptionsCartDto } from './dto/query-options-cart.dto';
import { ProductsService } from 'src/products/products.service';
import { errorMessages } from 'src/common/constants/error-messages';
import { Types } from 'mongoose';

@Controller('api/carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  async create(@Body() body: CreateCartDto, @Req() request: Request) {
    try {
      const response = await this.cartsService.create(body);
      return ApiResponse.create({
        data: response,
        message: cartSuccessCodes.SUCCESS_CREATE,
        customCode: customSuccessCodes.ResourceCreated,
        originUrl: request.url,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(cartErrorCodes.ERROR_CONFLICT);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query() options: QueryOptionsCartDto, @Req() request: Request) {
    try {
      let paginationOptions: QueryOptionsCartDto = {
        limit: options.limit !== undefined && options.limit !== null ? options.limit : 10,
        page: options.page || 1,
      };

      if (options.status) paginationOptions = { ...paginationOptions, status: options.status };

      const response = await this.cartsService.findAll(paginationOptions);

      return ApiResponse.success({
        data: response,
        message: cartSuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() request: Request) {
    try {
      const response = await this.cartsService.findById(id);

      if (!response) {
        throw new NotFoundException(cartErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: cartSuccessCodes.SUCCESS_FETCH,
        customCode: customSuccessCodes.ResourceFetched,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch('add/:cid/product/:pid')
  async addProductCart(
    @Param('cid', ParseObjectIdPipe) cid: string,
    @Param('pid', ParseObjectIdPipe) pid: string,
    @Body() body: UpdateCartDto,
    @Req() request: Request,
  ) {
    try {
      const { quantity = 1 } = body;

      if (quantity === 0) throw new BadRequestException(cartErrorCodes.ERROR_MIN_QUANTITY);

      const cartResponse = await this.cartsService.findById(cid);
      if (!cartResponse) throw new NotFoundException(`${errorMessages.ERROR_NOT_FOUND}: Cart`);

      const productResponse = await this.productsService.findById(pid);
      if (!productResponse) throw new NotFoundException(`${errorMessages.ERROR_NOT_FOUND}: Product`);

      if (productResponse.stock < quantity) throw new BadRequestException(cartErrorCodes.ERROR_NOT_STOCK);

      const productIndex = cartResponse.products.findIndex(product => product.product.toString() === pid);

      if (productIndex === -1) {
        cartResponse.products.push({ product: new Types.ObjectId(pid), quantity });
      } else {
        cartResponse.products[productIndex].quantity += quantity;
      }

      const response = await this.cartsService.updateCart(cartResponse);

      return ApiResponse.success({
        data: response,
        message: cartSuccessCodes.SUCCESS_UPDATE,
        customCode: customSuccessCodes.ResourceUpdated,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Patch('remove/:cid/product/:pid')
  async removeProductCart(
    @Param('cid', ParseObjectIdPipe) cid: string,
    @Param('pid', ParseObjectIdPipe) pid: string,
    @Body() body: UpdateCartDto,
    @Req() request: Request,
  ) {
    try {
      const { quantity = 1 } = body;

      const cartResponse = await this.cartsService.findById(cid);
      if (!cartResponse) throw new NotFoundException(cartErrorCodes.ERROR_NOT_FOUND);

      const productIndex = cartResponse.products.findIndex(product => product.product.toString() === pid);

      if (productIndex === -1) throw new NotFoundException(cartErrorCodes.ERROR_NOT_FOUND_PRODUCT);

      if (quantity === 0) {
        cartResponse.products = cartResponse.products.filter(product => product.product.toString() !== pid);
      } else {
        if (cartResponse.products[productIndex].quantity <= quantity) {
          throw new BadRequestException(cartErrorCodes.ERROR_STOCK_CONFLICT);
        }

        cartResponse.products[productIndex].quantity -= quantity;
      }

      const response = await this.cartsService.updateCart(cartResponse);

      return ApiResponse.success({
        data: response,
        message: cartSuccessCodes.SUCCESS_UPDATE,
        customCode: customSuccessCodes.ResourceUpdated,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string, @Req() request: Request) {
    try {
      const response = await this.cartsService.removeById(id);

      if (!response) {
        throw new NotFoundException(cartErrorCodes.ERROR_NOT_FOUND);
      }

      return ApiResponse.success({
        data: response,
        message: cartSuccessCodes.SUCCESS_DELETE,
        customCode: customSuccessCodes.ResourceDeleted,
        originUrl: request.url,
      });
    } catch (error) {
      throw error;
    }
  }
}
