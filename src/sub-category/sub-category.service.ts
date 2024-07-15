import { Injectable,HttpException, HttpStatus, } from '@nestjs/common';
import { PRODUCT_NOT_FOUND, UNABLE_TO_CREATE_CATEGORY, UNABLE_TO_GET_CATEGORY } from '@/common/constants/http-responses.types';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entity/subCategory.entity';
import { createSubCategoryDTO } from './dto/subCategory.dto';
import { Category } from '@/category/entity/category.entity';
@Injectable()
export class SubCategoryService {
    constructor(
        private readonly dataSource:DataSource,
        @InjectRepository(Category)
        private readonly categoryRepo:Repository<Category>,
        @InjectRepository(SubCategory)
        private readonly subCategoryRepo:Repository<SubCategory>
    ){}

    async getAllCategories(){
        const subCategories = await this.subCategoryRepo.find()
        if(subCategories){
          return {status:HttpStatus.OK, subCategories}
        }
        throw new HttpException(
          UNABLE_TO_GET_CATEGORY.message,
          UNABLE_TO_GET_CATEGORY.status
        )
      }

      async createSubCategory(body:createSubCategoryDTO){
        const {categoryId, subCategoryName, subCategoryDescription} = body
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
          const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
          console.log('cat',category)
          if (!category) {
            throw new Error('Category not found');
          }
          console.log('cat',category)
          const subCategory = await this.subCategoryRepo.create({
            subcategory_name:subCategoryName,
            subcategory_desc:subCategoryDescription,
            category:category
          })
          await this.subCategoryRepo.save(subCategory)
        } catch (error) {
          
        }
      }

      async delete(id:string){
          const category = await this.subCategoryRepo.find({where:{id}})
          if(!category || category.length===0){
                throw new HttpException(
                  PRODUCT_NOT_FOUND.message,
                  PRODUCT_NOT_FOUND.status
                )
          }
          await this.subCategoryRepo.delete({id});
          return category
    
      }
}
