import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { createCategoryDTO } from '@/category/dto/category.dto';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService:CategoryService){}

  @Post('category')
  createCategory(@Body() body:createCategoryDTO){
      return this.categoryService.createCategory(body)
    }

  @Get()
  getCategories(){
    return this.categoryService.getAllCategories()
  }
}
