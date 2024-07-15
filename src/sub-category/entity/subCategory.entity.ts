import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Category } from "../../category/entity/category.entity";
import Model from "@/common/entities/Model.entity";
import { Product } from "@/product/entities/product.entity";

@Entity('SubCategory')
export class SubCategory extends Model {
    @Column({
        name: 'subcategory_name',
        type: 'varchar',
        length: 100,
        nullable: false
      })
      subcategory_name: string;
    
      @Column({
        name: 'subcategory_desc',
        type: 'longtext',
      })
      subcategory_desc: string;

    @ManyToOne(()=>Category, (category)=>category.subCategory, {
        onDelete:'CASCADE',
      })
      category: Category;

    @OneToMany(()=>Product, ((product)=>product.subCategory),{
        onDelete:'CASCADE'
    })
    product:Product[]
}

 