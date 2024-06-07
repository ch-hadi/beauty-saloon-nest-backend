import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entity/category.entity';
import { CategoryService } from '@/category/category.service';
// import { CategoryModule } from '@/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category])],
  controllers: [ProductController],
  providers: [ProductService,CategoryService],
})
export class ProductModule {}
