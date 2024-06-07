import Model from '@/common/entities/Model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from '../../category/entity/category.entity';

@Entity('product')
export class Product extends Model {
  @Column({
    name: 'productName',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  productName: string;
  @Column({
    name: 'productPrice',
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  productPrice: string;

  @Column({
    name: 'productDescription',
    type: 'longtext',
    // length: 100,
    nullable: false,
  })
  productDescription: string;

 @ManyToOne(()=>Category, (category)=>category.product, {
  onDelete:'CASCADE',
 })
 category:Category
}
