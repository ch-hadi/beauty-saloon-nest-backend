import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TypeOrmConfigService } from './config/db.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { StripeModule } from './stripe/stripe.module';
import { EmailModule } from './email/email.module';
import { GraphsModule } from './graphs/graphs.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { Users } from './users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Category } from './category/entity/category.entity';
import { SubCategory } from './sub-category/entity/subCategory.entity';
import { Product } from './product/entities/product.entity';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    // }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database:'salon',
        entities: [Category, SubCategory, Users, Product],
        // logging:
        //   configService.get<string>('NODE_ENV') === 'PROD'
        //     ? ['query', 'error', 'log']
        //     : 'all',
        logger: 'advanced-console',
        synchronize: false,
        autoLoadEntities: true,
        maxQueryExecutionTime: 300,
      // }),
      // inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    StripeModule,
    EmailModule,
    GraphsModule,
    UserProfileModule,
    FileUploadModule,
    ProductModule,
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

