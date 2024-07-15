import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entity/subCategory.entity';
import { Category } from '@/category/entity/category.entity';
@Module({
  imports:[TypeOrmModule.forFeature([SubCategory,Category])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService,TypeOrmModule],
  exports:[TypeOrmModule,SubCategoryService]
})
export class SubCategoryModule {}
