import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Product } from './entities/product.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { createProductDTO } from './dto/product.dto';
import { createCategoryDTO } from './dto/category.dto';
import { updateProduct } from './dto/update-product.dto';
// import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productSerivces: ProductService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async allProducts() {
    const all = await this.productSerivces.getAllProducts();
    return all;
  }

  async allCategories(){
    return this.productSerivces.getAllCategories()
  }
  @Post()
  createNew(
    @Body() body:createProductDTO,
  ){
     return this.productSerivces.create(body)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body:updateProduct
  ){
    return this.productSerivces.update(id,body)
  }

  @Post('category')
  createCategory(@Body() body:createCategoryDTO){
      return this.productSerivces.createCategory(body)
    }
}
