import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Carts, CartsSchema } from 'src/schemas/carts/carts.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Carts.name, schema: CartsSchema }]), ProductsModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
