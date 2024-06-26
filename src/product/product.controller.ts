import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,UploadedFile, UseInterceptors  } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Product } from './entities/product.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { createProductDTO } from './dto/product.dto';
import { updateProduct } from './dto/update-product.dto';
import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import { JwtAuthGuard } from '@/auth/guards/local-auth.guard';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  static imageUrl: string;
  constructor(
    private readonly productSerivces: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async allProducts() {
    const all = await this.productSerivces.getAllProducts();
    return all;
  }

  // async allCategories(){
  //   return this.productSerivces.getAllCategories()
  // }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    type: createProductDTO,
  })
  createNew(
    @UploadedFile() file: Express.Multer.File,
    @Body() body:createProductDTO,
  ){
    if (file) {
      body.image = file.filename;
    }
     return this.productSerivces.create(body)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body:updateProduct
  ){
    return this.productSerivces.update(id,body)
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string){
    return this.productSerivces.delete(id)
  }
  @Post('/product-with-imapge')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    type: createProductDTO,
  })
  createNewPro(
    @UploadedFile() file: Express.Multer.File,
    @Body() body:createProductDTO,
  ){
    // console.log(file);
    if (file) {
      body.image = file.filename;
    }
    return this.imageUrl(file)
    //  return this.productSerivces.create(body)
  }

  private imageUrl(file: Express.Multer.File) {
    ProductController.imageUrl = `./${file.filename}`;
    return ProductController.imageUrl;
  }
  
}
