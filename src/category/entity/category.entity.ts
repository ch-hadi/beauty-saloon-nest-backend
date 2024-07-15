import { Column, Entity, OneToMany } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { SubCategory } from "../../sub-category/entity/subCategory.entity";
import Model from "@/common/entities/Model.entity";

@Entity('Category')
export class Category extends Model {
    @Column({
        name: 'categoryName',
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    categoryName: string;

    @Column({
        name: 'categoryDescription',
        nullable: true,
        type: 'longtext',
    })
    categoryDescription: string;

    // @OneToMany(() => Product, (product) => product.category, { onDelete: 'CASCADE' })
    // product: Product[];

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category, { onDelete: 'CASCADE' })
    subCategory: SubCategory[];
}
