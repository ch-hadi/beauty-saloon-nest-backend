import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createProductDTO } from './dto/product.dto';
import { PRODUCT_NOT_FOUND, UNABLE_TO_CREATE_CATEGORY, UNABLE_TO_CREATE_PRODUCT, UNABLE_TO_GET_CATEGORY } from '@/common/constants/http-responses.types';
// import { createCategoryDTO } from '../category/dto/category.dto';
import { updateProduct } from './dto/update-product.dto';
import { Category } from '@/category/entity/category.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    @InjectRepository(Category)
    private readonly categoryRepo:Repository<Category>
  ) {}
  async getAllProducts() {
    const all = await this.productRepo.find({
      relations:{
        category:true
      }
    });
    return all;
  }
  async create(productDto: createProductDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const category = await this.categoryRepo.findOne({
        where: { id: productDto.categoryId },
      });
      if (!category) {
        throw new HttpException('Category not found', 404);
      }
      const newProduct = this.productRepo.create({
        ...productDto,
        category: category,
      });

      await this.productRepo.save(newProduct);
      await queryRunner.commitTransaction();
      return newProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        UNABLE_TO_CREATE_PRODUCT.message,
        UNABLE_TO_CREATE_PRODUCT.status,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async update(id:string, body:updateProduct){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
        const product = await this.productRepo.find({
          where:{
            id:id
          },
          relations:{
            category:true
          }
        })
        if(body.categoryId){
          const category = await this.categoryRepo.findOne({
            where:{
              id:body.categoryId
            }
          })
          if (!category) {
            throw new HttpException('Category not found', 404);
          }
          // product[0].category = category
          this.productRepo.update(id, {
            productName:body.productName,
            productPrice:body.productPrice,
            productDescription:body.productDescription,
            category:category
          })
         
        }
        if(product.length===0){
          throw new HttpException(
            PRODUCT_NOT_FOUND.message,
            PRODUCT_NOT_FOUND.status
          );
        }
  }
  // async getAllCategories(){
  //   const allCategories = await this.categoryRepo.find()
  //   if(allCategories){
  //     return {status:HttpStatus.OK, allCategories}
  //   }
  //   throw new HttpException(
  //     UNABLE_TO_GET_CATEGORY.message,
  //     UNABLE_TO_GET_CATEGORY.status
  //   )
  // }
  async delete(id:string){
      const product = await this.productRepo.find({where:{id}})
      if(!product || product.length===0){
            throw new HttpException(
              PRODUCT_NOT_FOUND.message,
              PRODUCT_NOT_FOUND.status
            )
      }
      await this.productRepo.delete({id});
      return product

  }
}
