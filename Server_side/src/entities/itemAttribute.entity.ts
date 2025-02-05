import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import {Item} from "./item.entity";
import {Attribute} from "./attribute.entity";

@Entity()
export class ItemAttribute {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item, item => item.attributes)
    item: Item;

    @ManyToOne(() => Attribute)
    attribute: Attribute;

    @Column({ nullable: true })
    stringValue: string;

    @Column({ nullable: true })
    numberValue: number;

    @Column({ nullable: true })
    booleanValue: boolean;
}