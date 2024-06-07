import { PRODUCT_NOT_FOUND, UNABLE_TO_CREATE_CATEGORY, UNABLE_TO_GET_CATEGORY } from '@/common/constants/http-responses.types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category} from './entity/category.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createCategoryDTO } from './dto/category.dto';
@Injectable()
export class CategoryService {
    constructor(
        private readonly dataSource:DataSource,
        @InjectRepository(Category)
        private readonly categoryRepo:Repository<Category>){}

    async getAllCategories(){
        const allCategories = await this.categoryRepo.find()
        if(allCategories){
          return {status:HttpStatus.OK, allCategories}
        }
        throw new HttpException(
          UNABLE_TO_GET_CATEGORY.message,
          UNABLE_TO_GET_CATEGORY.status
        )
      }
      async createCategory(body:createCategoryDTO){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
          const category = await this.categoryRepo.create(body);
          await category.save()
          if(category){
            return {status:HttpStatus.OK, category}
          }
          throw new HttpException(
            UNABLE_TO_CREATE_CATEGORY.message,
            UNABLE_TO_CREATE_CATEGORY.status
          )
        } catch (error:any) {
          throw new Error(error)
        }
      }
      async delete(id:string){
          const category = await this.categoryRepo.find({where:{id}})
          if(!category || category.length===0){
                throw new HttpException(
                  PRODUCT_NOT_FOUND.message,
                  PRODUCT_NOT_FOUND.status
                )
          }
          await this.categoryRepo.delete({id});
          return category
    
      }
}
