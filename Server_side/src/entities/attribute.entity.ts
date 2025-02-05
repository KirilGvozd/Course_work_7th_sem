import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {Category} from "./category.entity";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.attributes)
    category: Category;

    @Column({
        type: "enum",
        enum: ["STRING", "NUMBER", "BOOLEAN"]
    })
    type: "STRING" | "NUMBER" | "BOOLEAN";
}