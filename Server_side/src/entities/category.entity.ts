import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import {Attribute} from "./attribute.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.children)
    parent?: Category;

    @OneToMany(() => Category, category => category.parent)
    children?: Category[];

    @OneToMany(() => Attribute, attribute => attribute.category)
    attributes: Attribute[];
}