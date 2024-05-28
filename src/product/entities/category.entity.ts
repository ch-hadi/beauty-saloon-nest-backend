import Model from "@/common/entities/Model.entity";
import { Column,Entity, OneToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity('Category')
export class Category extends Model {
    @Column({
        name:'categoryName',
        type:'varchar',
        length:50,
        nullable:false,
    })
    categoryName:string;

    @Column({
        name:'categoryDescription',
        nullable:true,
        type:'longtext',
    })
    categoryDescription:string;

@OneToMany(()=>Product, (product)=> product.category, {onDelete:'CASCADE'})
product:Product[]
}