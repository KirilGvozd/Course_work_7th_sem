import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Category} from "./category.entity";
import {ItemAttribute} from "./itemAttribute.entity";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.attributes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column({ nullable: false })
    categoryId: number;

    @OneToMany(() => ItemAttribute, attribute => attribute.attribute, { onDelete: "CASCADE" })
    itemAttributes: ItemAttribute[];

    @Column({
        type: "enum",
        enum: ["STRING", "NUMBER", "BOOLEAN"]
    })
    type: "STRING" | "NUMBER" | "BOOLEAN";
}