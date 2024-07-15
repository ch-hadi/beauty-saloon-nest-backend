import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { createSubCategoryDTO } from './dto/subCategory.dto';
import { SubCategoryService } from './sub-category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subcategories')
@Controller('Subcategories')
export class SubCategoryController {

    constructor(private readonly subCategoryService:SubCategoryService){}

    @Post()
    createSubCategory(@Body() body: createSubCategoryDTO) {

        return this.subCategoryService.createSubCategory(body)
    }

    @Get()
    getCategories() {
        return this.subCategoryService.getAllCategories()
    }

    @Delete()
    deleteSubCategories(@Param('id') id:string) {

        return this.subCategoryService.delete(id)
    }
}
