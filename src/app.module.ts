import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/ml-clone-db'), ProductsModule, CategoriesModule, CartsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
